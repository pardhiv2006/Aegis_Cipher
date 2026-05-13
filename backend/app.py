from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
import pytz
from functools import wraps
from models import db, User, File, AccessLog, Role, Department, UserSession
from abe_logic import simulate_abe_encrypt, simulate_abe_decrypt
import os
import io
import google.generativeai as genai
from dotenv import load_dotenv
from groq import Groq
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

load_dotenv()

# Gemini Configuration (Fallback)
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "YOUR_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')
IST = pytz.timezone('Asia/Kolkata')

# Groq Configuration (Primary)
def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if api_key and api_key != "YOUR_GROQ_API_KEY_HERE":
        try:
            return Groq(api_key=api_key)
        except Exception as e:
            print(f"Groq Init Error: {e}")
    return None

# Database Configuration with Persistent Path
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
# Ensure the database is stored in a predictable, persistent location in the instance folder
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'abe_system.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key-for-abe-project'

# Ensure instance folder exists
if not os.path.exists(os.path.join(basedir, 'instance')):
    os.makedirs(os.path.join(basedir, 'instance'))

CORS(app, supports_credentials=True, expose_headers=["x-access-token"], allow_headers=["Content-Type", "x-access-token"])
bcrypt = Bcrypt(app)
db.init_app(app)

# JWT Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            # Use db.session.get for robust lookup
            current_user = db.session.get(User, data['user_id'])
            if not current_user:
                return jsonify({'message': 'User identity no longer exists in database.'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Session expired. Please re-authenticate.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid security token.'}), 401
        except Exception as e:
            return jsonify({'message': f'Authentication error: {str(e)}'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/validate-session', methods=['GET'])
@token_required
def validate_session(current_user):
    """Robust session validation to ensure frontend and backend are in sync."""
    return jsonify({
        'valid': True,
        'user': current_user.to_dict()
    })

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Missing fields'}), 400
        
    username = data['username'].strip()
    email = data.get('email', '').strip()
    
    # Email validation: Must end with .com or .in
    if not (email.lower().endswith('.com') or email.lower().endswith('.in')):
        return jsonify({'message': 'Registration error: Email must end with .com or .in'}), 400

    # Custom duplicate check: Only block if BOTH match EXACTLY (Case Sensitive)
    existing_user = User.query.filter_by(username=username, email=email).first()
    if existing_user:
        return jsonify({'message': 'Identity Conflict: A user with this name and email already exists.'}), 400
        
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role=data.get('role', 'Student'),
        department=data.get('department', 'AI'),
        access_level=data.get('access_level', 'Basic')
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    # Case-sensitive login
    user = User.query.filter_by(username=username).first()
    
    if not user:
        print(f"Login failed: User {username} not found")
        return jsonify({'message': 'Invalid Login Credentials'}), 401
        
    if not bcrypt.check_password_hash(user.password_hash, password):
        print(f"Login failed: Incorrect password for {username}")
        return jsonify({'message': 'Invalid Login Credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # Update online status
    user.is_online = True
    user.last_login = datetime.datetime.now(IST)
    
    # If user already has a role/dept, create a session record immediately
    if user.role and user.department:
        new_session = UserSession(
            user_id=user.id,
            username=user.username,
            email=user.email or f"{user.username.lower()}@university.edu",
            role=user.role,
            department=user.department,
            login_time=datetime.datetime.now(IST),
            is_active=True
        )
        db.session.add(new_session)

    new_log = AccessLog(
        username=user.username,
        file_name='__AUTH__',
        action_type='Login',
        access_status='Success',
        timestamp=datetime.datetime.now(IST)
    )
    db.session.add(new_log)
    db.session.commit()

    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

@app.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    user = db.session.get(User, current_user.id)
    if user:
        user.is_online = False
        
        # Mark ALL active sessions for this user as inactive on logout
        active_sessions = UserSession.query.filter_by(user_id=user.id, is_active=True).all()
        for s in active_sessions:
            s.is_active = False
            s.logout_time = datetime.datetime.now(IST)
        
        db.session.commit()
        
        # Log logout event
        new_log = AccessLog(
            username=user.username,
            file_name='__AUTH__',
            action_type='Logout',
            access_status='Success',
            timestamp=datetime.datetime.now(IST)
        )
        db.session.add(new_log)
        db.session.commit()
        
    return jsonify({'message': 'Logged out successfully'})

@app.route('/files', methods=['GET'])
@token_required
def get_files(current_user):
    if current_user.role == 'Admin':
        files = File.query.order_by(File.id.asc()).all()
    else:
        # VERY IMPORTANT: Hide Admin-only files from normal users
        files = File.query.filter(
            File.role_access != 'Admin',
            File.file_category != 'System Infrastructure'
        ).order_by(File.id.asc()).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/file/<int:file_id>', methods=['GET'])
@token_required
def get_file_content(current_user, file_id):
    file = File.query.get_or_404(file_id)
    
    if current_user.role == 'Admin':
        from abe_logic import base64
        decrypted_content = base64.b64decode(file.encrypted_content).decode('utf-8')
        status = "Granted"
        authorized = True
    else:
        decrypted_content = simulate_abe_decrypt(
            file.encrypted_content,
            current_user.role,
            current_user.department,
            file.role_access,
            file.department_access
        )
        status = "Granted" if decrypted_content else "Denied"
        authorized = decrypted_content is not None
    
    # Log access attempt
    new_log = AccessLog(
        username=current_user.username,
        file_name=file.file_name,
        action_type='File Access',
        access_status=status,
        timestamp=datetime.datetime.now(IST)
    )
    db.session.add(new_log)
    db.session.commit()
    
    response_data = file.to_dict()
    if authorized:
        response_data.update({'content': decrypted_content, 'authorized': True})
    else:
        # Create a redacted preview for unauthorized users
        # Show first 100 chars of encrypted content then redact
        redacted = f"{file.encrypted_content[:120]}...\n" + "█" * 30 + "\n" + "█" * 45 + "\n" + "█" * 20
        response_data.update({
            'content': redacted,
            'authorized': False,
            'message': f'⚠ ACCESS DENIED: Security Protocol requires {file.role_access} + {file.department_access} clearance.'
        })
        
    return jsonify(response_data)

@app.route('/logs', methods=['GET'])
@token_required
def get_logs(current_user):
    if current_user.role == 'Admin':
        logs = AccessLog.query.order_by(AccessLog.timestamp.desc()).all()
    else:
        logs = AccessLog.query.filter_by(username=current_user.username).order_by(AccessLog.timestamp.desc()).all()
    return jsonify([l.to_dict() for l in logs])

@app.route('/update_profile', methods=['POST'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    user = db.session.get(User, current_user.id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
        
    old_role, old_dept = user.role, user.department
    user.role = data.get('role', user.role)
    user.department = data.get('department', user.department)
    
    # Create a NEW Session record for the newly selected role/dept
    
    # Optional: Mark previous sessions for this user as inactive if switching
    UserSession.query.filter_by(user_id=user.id, is_active=True).update({'is_active': False, 'logout_time': datetime.datetime.now(IST)})
    
    new_session = UserSession(
        user_id=user.id,
        username=user.username,
        email=user.email or f"{user.username.lower()}@university.edu",
        role=user.role,
        department=user.department,
        login_time=datetime.datetime.now(IST),
        is_active=True
    )
    db.session.add(new_session)
    
    new_log = AccessLog(
        username=user.username,
        file_name='Profile_Update',
        action_type='Context Switch',
        access_status=f"{old_role}/{old_dept} -> {user.role}/{user.department}",
        timestamp=datetime.datetime.now(IST)
    )
    db.session.add(new_log)
    db.session.commit()
    
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()})

@app.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    if current_user.role == 'Admin':
        total_files = File.query.count()
        accessible_count = total_files
    else:
        # Filter out Admin-only files from user stats
        total_files = File.query.filter(File.role_access != 'Admin', File.file_category != 'System Infrastructure').count()
        all_files = File.query.filter(File.role_access != 'Admin', File.file_category != 'System Infrastructure').all()
        accessible_count = sum(1 for f in all_files if (f.role_access == 'All' or f.role_access == current_user.role) and (f.department_access == 'All' or f.department_access == current_user.department))

    restricted_attempts = AccessLog.query.filter_by(username=current_user.username, access_status='Denied').count()
    recent = AccessLog.query.filter_by(username=current_user.username).order_by(AccessLog.timestamp.desc()).limit(10).all()
    
    return jsonify({
        'total_files': total_files,
        'accessible_files': accessible_count,
        'restricted_attempts': restricted_attempts,
        'recent_activity': [l.to_dict() for l in recent]
    })

@app.route('/ai-summary', methods=['POST'])
@token_required
def get_ai_summary(current_user):
    data = request.get_json()
    file_id = data.get('file_id')
    file = db.session.get(File, file_id)
    if not file:
        return jsonify({'message': 'Resource not found'}), 404
        
    if current_user.role == 'Admin':
        from abe_logic import base64
        decrypted_content = base64.b64decode(file.encrypted_content).decode('utf-8')
    else:
        decrypted_content = simulate_abe_decrypt(
            file.encrypted_content, current_user.role, current_user.department,
            file.role_access, file.department_access
        )
    
    if not decrypted_content:
        return jsonify({'message': 'Security Breach: Unauthorized AI Access'}), 403

    try:
        prompt = f"""
        You are 'Aegis', a university security AI. Summarize the following document in exactly 5-6 lines of descriptive, narrative English. 
        
        CRITICAL RULES:
        - DO NOT include raw data lines, tables, or pipes (e.g., No 'Name | Score' or 'Rajesh | 18/20').
        - Convert any marks or data into descriptive sentences. (e.g., 'Rajesh C. secured 18 out of 20' instead of raw values).
        - NEVER use placeholders like '---', '...', or '|'.
        - Describe the content as a cohesive report to a Dean.
        - Do not use headers or bullet points.
        
        Document Name: {file.file_name}
        File Category: {file.file_category}
        Decrypted Content: {decrypted_content[:3000]}
        """
        
        groq = get_groq_client()
        if groq:
            chat_completion = groq.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are Aegis, a university security AI. You transform raw data into descriptive narrative sentences. You never use tables, pipes, or raw score lines."}, 
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.1-8b-instant",
            )
            summary = chat_completion.choices[0].message.content.strip()
        else:
            response = gemini_model.generate_content(prompt)
            summary = response.text.strip()
        
        # Final cleanup to ensure no raw pipes or dashes leak through
        summary = summary.replace('---', ' ').replace('|', ' ').replace('  ', ' ').strip()
        
    except Exception as e:
        print(f"AI Summary Error: {e}")
        lines = decrypted_content.split('\n')
        topic = next((l.split(':')[-1].strip() for l in lines if any(x in l for x in ["Subject:", "Topic:", "Title:"])), "Academic Resources")
        
        # Improved Fallback: Convert markers into descriptive sentences
        narrative_highlights = []
        for l in lines:
            ls = l.strip()
            if not ls or ls.startswith('---') or '|' in ls: continue
            
            # Simple narrative conversion for common academic patterns
            if "Assignment 1" in ls and ":" in ls:
                val = ls.split(":")[-1].strip()
                narrative_highlights.append(f"The student achieved a score of {val} in Assignment 1")
            elif "Attendance" in ls and ":" in ls:
                val = ls.split(":")[-1].strip()
                narrative_highlights.append(f"The calculated attendance stands at {val}")
            elif "Mid-Term" in ls and ":" in ls:
                val = ls.split(":")[-1].strip()
                narrative_highlights.append(f"The midterm evaluation resulted in a score of {val}")
            elif any(x in ls for x in ["%", "Marks", "CTC", "LPA", "Grade"]):
                narrative_highlights.append(ls.strip('- *'))
        
        if not narrative_highlights:
            narrative_highlights = [l.strip('- ').strip() for l in lines if l.strip().startswith(('-', '1.', '2.')) and len(l.strip('- ').strip()) > 5]
            
        points_str = ". ".join(narrative_highlights[:3]) if narrative_highlights else "The document outlines key institutional metrics and performance indicators"
        
        summary = f"This comprehensive report for '{file.file_name}' formalizes the current status of {topic.lower()} within the {file.department_access} department. {points_str}. These details are vital for maintaining the university's academic integrity. For a {current_user.role}, this summary provides a secure and narrative interpretation of the departmental data fragments."

    file.summary = summary # Cache for PDF download
    db.session.add(AccessLog(username=current_user.username, file_name=file.file_name, action_type='AI Summary', access_status='Success', timestamp=datetime.datetime.now(IST)))
    db.session.commit()
    return jsonify({'summary': summary})

@app.route('/ai-chat', methods=['POST'])
@token_required
def ai_chat(current_user):
    data = request.get_json()
    query = data.get('query', '')
    
    try:
        prompt = f"You are Aegis AI Security Assistant. User: {current_user.role} from {current_user.department}. Question: {query}. Answer in simple, descriptive English."
        groq = get_groq_client()
        if groq:
            chat_completion = groq.chat.completions.create(
                messages=[{"role": "system", "content": "You are Aegis AI."}, {"role": "user", "content": prompt}],
                model="llama-3.1-8b-instant",
            )
            response = chat_completion.choices[0].message.content.strip()
        else:
            response = gemini_model.generate_content(prompt).text.strip()
    except Exception as e:
        response = f"I am your Aegis Security Assistant. Based on your role as {current_user.role}, I can guide you through the repository's ABE policies."

    db.session.add(AccessLog(username=current_user.username, file_name='AI_Chat', action_type='Chat', access_status='Success'))
    db.session.commit()
    return jsonify({'response': response})

@app.route('/admin/stats', methods=['GET'])
@token_required
def get_admin_stats(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    from sqlalchemy import func
    return jsonify({
        'total_users': User.query.count(),
        'total_files': File.query.count(),
        'total_departments': db.session.query(Department.id).count(),
        'access_granted': AccessLog.query.filter_by(access_status='Granted').count(),
        'access_denied': AccessLog.query.filter_by(access_status='Denied').count(),
        'role_distribution': [{'role': r, 'count': c} for r, c in db.session.query(User.role, func.count(User.id)).group_by(User.role).all()],
        'online_users': User.query.filter_by(is_online=True).count()
    })

@app.route('/admin/sessions', methods=['GET'])
@token_required
def admin_get_sessions(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    # Return all session records (Requirement: separate rows for each login/selection)
    sessions = UserSession.query.order_by(UserSession.login_time.desc()).all()
    return jsonify([s.to_dict() for s in sessions])

@app.route('/admin/users', methods=['GET'])
@token_required
def admin_get_users(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@app.route('/admin/files', methods=['GET'])
@token_required
def admin_get_files(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    files = File.query.all()
    return jsonify([f.to_dict() for f in files])

@app.route('/admin/add-file', methods=['POST'])
@token_required
def admin_add_file(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    
    file_name = data.get('file_name', 'Untitled.pdf')
    if not file_name.endswith('.pdf'): file_name += '.pdf'
    
    content = data.get('content', '')
    role_access = data.get('role_access', 'Admin')
    dept_access = data.get('department_access', 'All')
    category = data.get('category', 'Administrative')
    
    # Auto encrypt content
    encrypted = simulate_abe_encrypt(content)
    
    new_file = File(
        file_name=file_name,
        file_type='PDF',
        file_category=category,
        encrypted_content=encrypted,
        role_access=role_access,
        department_access=dept_access,
        access_level='Full' if role_access == 'Admin' else 'Basic'
    )
    
    db.session.add(new_file)
    db.session.add(AccessLog(
        username=current_user.username,
        file_name=file_name,
        action_type='Admin Create',
        access_status=f"Created for {role_access}/{dept_access}",
        timestamp=datetime.datetime.now(IST)
    ))
    db.session.commit()
    return jsonify({'message': 'File created and encrypted successfully!'})

@app.route('/admin/roles', methods=['GET', 'POST'])
@token_required
def manage_roles(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name', '').strip()
        if not name:
            return jsonify({'message': 'Attribute name is required'}), 400
            
        if Role.query.filter_by(name=name).first():
            return jsonify({'message': f'Error: Role "{name}" already exists in the policy engine.'}), 400
            
        db.session.add(Role(name=name))
        db.session.add(AccessLog(username=current_user.username, file_name=f"Role: {name}", action_type='Role Created', access_status='Success', timestamp=datetime.datetime.now(IST)))
        db.session.commit()
        return jsonify({'message': f'Role "{name}" successfully deployed to the identity cluster.'}), 201
        
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles])

@app.route('/admin/departments', methods=['GET', 'POST'])
@token_required
def manage_departments(current_user):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name', '').strip()
        if not name:
            return jsonify({'message': 'Department name is required'}), 400
            
        if Department.query.filter_by(name=name).first():
            return jsonify({'message': f'Error: Department "{name}" is already registered.'}), 400
            
        db.session.add(Department(name=name))
        db.session.add(AccessLog(username=current_user.username, file_name=f"Dept: {name}", action_type='Department Added', access_status='Success', timestamp=datetime.datetime.now(IST)))
        db.session.commit()
        return jsonify({'message': f'Department "{name}" authorized and active in topology.'}), 201
        
    depts = Department.query.all()
    return jsonify([d.to_dict() for d in depts])

@app.route('/download-pdf/<int:file_id>')
@token_required
def download_pdf(current_user, file_id):
    file = File.query.get_or_404(file_id)
    
    # Check authorization
    if current_user.role == 'Admin':
        from abe_logic import base64
        content = base64.b64decode(file.encrypted_content).decode('utf-8')
        authorized = True
    else:
        content = simulate_abe_decrypt(file.encrypted_content, current_user.role, current_user.department, file.role_access, file.department_access)
        authorized = content is not None

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=16, spaceAfter=20)
    meta_style = ParagraphStyle('MetaStyle', parent=styles['Normal'], fontSize=10, textColor='#666666', spaceAfter=5)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], fontSize=14, spaceAfter=10, color='#1e293b')
    content_style = ParagraphStyle('ContentStyle', parent=styles['Normal'], fontSize=10, leading=14)
    summary_style = ParagraphStyle('SummaryStyle', parent=styles['BodyText'], fontName='Helvetica-Oblique', fontSize=11, leading=16, leftIndent=20, borderPadding=10, textColor='#4338ca')

    elements = []
    
    elements.append(Paragraph("AEGIS SECURE REPOSITORY", title_style))
    elements.append(Paragraph(f"Resource: {file.file_name}", meta_style))
    elements.append(Paragraph(f"Downloaded by: {current_user.username} ({current_user.role})", meta_style))
    elements.append(Paragraph(f"Timestamp: {datetime.datetime.now(IST).strftime('%Y-%m-%d %H:%M:%S IST')}", meta_style))
    elements.append(Spacer(1, 0.2*inch))
    
    if authorized:
        elements.append(Paragraph("ACCESS VERIFIED - DECRYPTED DOCUMENT", header_style))
        for line in content.split('\n'):
            if line.strip():
                safe_line = html.escape(line)
                elements.append(Paragraph(safe_line, content_style))
        
        if file.summary:
            elements.append(Spacer(1, 0.4*inch))
            elements.append(Paragraph("AEGIS AI ASSISTANT SUMMARY", header_style))
            safe_summary = html.escape(file.summary).replace('\n', '<br/>')
            elements.append(Paragraph(safe_summary, summary_style))
    else:
        elements.append(Paragraph("⚠ SECURITY ACCESS DENIED", header_style))
        elements.append(Paragraph("Security Protocol: ABE Policy Violation Detected.", content_style))
        elements.append(Spacer(1, 0.5*inch))
        elements.append(Paragraph("ENCRYPTED PREVIEW PAYLOAD:", meta_style))
        safe_encrypted = html.escape(file.encrypted_content[:200])
        elements.append(Paragraph(f"{safe_encrypted}...", content_style))

    doc.build(elements)
    buffer.seek(0)
    
    db.session.add(AccessLog(
        username=current_user.username,
        file_name=file.file_name,
        action_type='PDF Downloaded',
        access_status='Success' if authorized else 'Blocked (Secure PDF)',
        timestamp=datetime.datetime.now(IST)
    ))
    db.session.commit()
    
    return send_file(buffer, as_attachment=True, download_name=f"SECURE_{file.file_name}", mimetype='application/pdf')

@app.route('/admin/files/<int:file_id>', methods=['DELETE'])
@token_required
def admin_delete_file(current_user, file_id):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    file = File.query.get_or_404(file_id)
    db.session.delete(file)
    db.session.commit()
    return jsonify({'message': 'File deleted successfully'})

@app.route('/admin/roles/<int:role_id>', methods=['DELETE'])
@token_required
def admin_delete_role(current_user, role_id):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({'message': 'Role deleted successfully'})

@app.route('/admin/departments/<int:dept_id>', methods=['DELETE'])
@token_required
def admin_delete_dept(current_user, dept_id):
    if current_user.role != 'Admin': return jsonify({'message': 'Unauthorized'}), 403
    dept = Department.query.get_or_404(dept_id)
    db.session.delete(dept)
    db.session.commit()
    return jsonify({'message': 'Department deleted successfully'})

@app.route('/roles', methods=['GET'])
def get_public_roles():
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles])

@app.route('/departments', methods=['GET'])
def get_public_departments():
    depts = Department.query.all()
    return jsonify([d.to_dict() for d in depts])

# Seed Content
from seed_content import generate_student_content, generate_faculty_content, generate_lab_content, generate_hod_content, generate_admin_content

def seed_data():
    # 1. Dynamic Roles & Depts (STRICT LIST - NO 'ALL')
    initial_roles = ['Student', 'Faculty', 'Lab Assistant', 'HOD', 'Admin']
    initial_depts = ['AI', 'CSE', 'Civil', 'Mechanical']
    
    for r in initial_roles:
        if not Role.query.filter_by(name=r).first(): db.session.add(Role(name=r))
    for d in initial_depts:
        if not Department.query.filter_by(name=d).first(): db.session.add(Department(name=d))
    db.session.commit()

    # 2. Test Users (Keep existing if available)
    test_users = [
        {'username': 'admin', 'password': 'admin123', 'role': 'Admin', 'dept': 'AI'},
        {'username': 'PARDHU', 'password': 'password123', 'role': 'Student', 'dept': 'AI'},
        {'username': 'hello', 'password': 'password123', 'role': 'Student', 'dept': 'AI'}
    ]
    for u in test_users:
        if not User.query.filter(db.func.lower(User.username) == db.func.lower(u['username'])).first():
            db.session.add(User(
                username=u['username'], 
                password_hash=bcrypt.generate_password_hash(u['password']).decode('utf-8'), 
                role=u['role'], 
                department=u['dept'], 
                access_level='Full'
            ))
    db.session.commit()

    # 3. File Repository (EXACT 101 FILES ORDER - REFRESHED)
    File.query.delete()
    AccessLog.query.delete()
    db.session.commit()
    
    depts = ['AI', 'CSE', 'Civil', 'Mechanical']

    # --- 1. STUDENT ROLE FILES ---
    student_files = [
        ('Notes', 'Student_Notes', 'Subject notes'),
        ('Assignment', 'Assignment_Questions', 'Assignments'),
        ('Project', 'Project_Report', 'Mini/major projects'),
        ('Syllabus', 'Syllabus', 'Syllabus'),
        ('Exam', 'Exam_Preparation', 'Exam materials')
    ]
    for dept in depts:
        for t_key, t_name, desc in student_files:
            db.session.add(File(
                file_name=f"{dept}_{t_name}.pdf",
                file_type='PDF',
                file_category='Student Resources',
                encrypted_content=simulate_abe_encrypt(generate_student_content(dept, t_key)),
                role_access='Student',
                department_access=dept,
                access_level='Basic'
            ))

    # --- 2. FACULTY ROLE FILES ---
    faculty_files = [
        ('Research', 'Faculty_Research', 'Research overview'),
        ('Marks', 'Internal_Marks', 'Student marks'),
        ('Attendance', 'Attendance_Report', 'Attendance details'),
        ('Planning', 'Semester_Planning', 'Academic planning'),
        ('Questions', 'Question_Bank', 'Question papers')
    ]
    for dept in depts:
        for t_key, t_name, desc in faculty_files:
            db.session.add(File(
                file_name=f"{dept}_{t_name}.pdf",
                file_type='PDF',
                file_category='Faculty Documents',
                encrypted_content=simulate_abe_encrypt(generate_faculty_content(dept, t_key)),
                role_access='Faculty',
                department_access=dept,
                access_level='Premium'
            ))

    # --- 3. LAB ASSISTANT ROLE FILES ---
    lab_files = [
        ('Manual', 'Lab_Manual', 'Practical manual'),
        ('Experiment', 'Experiment_Data', 'Experiment records'),
        ('Hardware', 'Hardware_Setup', 'Lab setup instructions'),
        ('Inventory', 'Lab_Inventory', 'Equipment list'),
        ('Maintenance', 'System_Maintenance', 'Maintenance logs')
    ]
    for dept in depts:
        for t_key, t_name, desc in lab_files:
            db.session.add(File(
                file_name=f"{dept}_{t_name}.pdf",
                file_type='PDF',
                file_category='Laboratory Assets',
                encrypted_content=simulate_abe_encrypt(generate_lab_content(dept, t_key if t_key != 'Maintenance' else 'Health')),
                role_access='Lab Assistant',
                department_access=dept,
                access_level='Basic'
            ))

    # --- 4. HOD ROLE FILES ---
    hod_files = [
        ('Audit', 'Department_Attendance', 'Attendance statistics'),
        ('Performance', 'Faculty_Performance', 'Faculty evaluations'),
        ('Research', 'Faculty_Research', 'Research overview'),
        ('Results', 'Department_Results', 'Pass/fail analysis'),
        ('Budget', 'Budget_Report', 'Department expenses'),
        ('Staff', 'Staff_Management', 'Staff records'),
        ('Meetings', 'Meeting_Reports', 'Department meetings'),
        ('Strategy', 'Department_Strategy', 'Academic planning'),
        ('Placement', 'Placement_Statistics', 'Placement reports')
    ]
    for dept in depts:
        for t_key, t_name, desc in hod_files:
            # Map type keys to content generator keys
            c_key = t_key
            if t_key == 'Staff': c_key = 'Strategy'
            if t_key == 'Meetings': c_key = 'Performance'
            
            db.session.add(File(
                file_name=f"{dept}_{t_name}.pdf",
                file_type='PDF',
                file_category='Management Records',
                encrypted_content=simulate_abe_encrypt(generate_hod_content(dept, c_key)),
                role_access='HOD',
                department_access=dept,
                access_level='Full'
            ))

    # --- 5. ADMIN FILES (Last 5) ---
    admin_files = [
        ('System_Logs', 'System_Logs.pdf', 'System logs'),
        ('Server_Configuration', 'Server_Configuration.pdf', 'Server settings'),
        ('User_Access_Records', 'User_Access_Records.pdf', 'User management'),
        ('Security_Reports', 'Security_Reports.pdf', 'Security audits'),
        ('Database_Backup', 'Database_Backup.pdf', 'Database backups')
    ]
    for t_key, t_name, desc in admin_files:
        db.session.add(File(
            file_name=t_name,
            file_type='PDF',
            file_category='System Infrastructure',
            encrypted_content=simulate_abe_encrypt(generate_admin_content(t_key)),
            role_access='Admin',
            department_access='AI',
            access_level='Full'
        ))

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()
    app.run(debug=True, port=5001)
