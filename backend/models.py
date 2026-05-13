from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False) # Student, Faculty, Lab Assistant, HOD, Admin
    department = db.Column(db.String(20), nullable=False) # AI, CSE, Civil, Mechanical
    access_level = db.Column(db.String(20), nullable=False) # Basic, Premium, Full
    is_online = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "access_level": self.access_level,
            "is_online": self.is_online,
            "last_login": self.last_login.strftime("%Y-%m-%d %H:%M:%S") if self.last_login else "Never"
        }

class UserSession(db.Model):
    __tablename__ = 'user_sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(50), nullable=False)
    login_time = db.Column(db.DateTime, default=datetime.utcnow)
    logout_time = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "login_time": self.login_time.strftime("%d %b %Y • %I:%M %p IST") if self.login_time else "Unknown",
            "is_active": self.is_active
        }

class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(120), nullable=False)
    file_type = db.Column(db.String(50), default='PDF') # PDF, DOC, XLS
    file_category = db.Column(db.String(50)) # Assignment, Research, Policy, Inventory, etc.
    encrypted_content = db.Column(db.Text, nullable=False)
    role_access = db.Column(db.String(50), nullable=False) 
    department_access = db.Column(db.String(50), nullable=False)
    access_level = db.Column(db.String(20), default='Basic') # Basic, Premium, Full
    description = db.Column(db.String(255))
    summary = db.Column(db.Text) # AI-generated summary cache
    status = db.Column(db.String(20), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "file_name": self.file_name,
            "file_type": self.file_type,
            "file_category": self.file_category,
            "role_access": self.role_access,
            "department_access": self.department_access,
            "access_level": self.access_level,
            "description": self.description,
            "summary": self.summary,
            "status": self.status,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M")
        }

class AccessLog(db.Model):
    __tablename__ = 'logs'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    file_name = db.Column(db.String(120), nullable=False)
    action_type = db.Column(db.String(50), default='File Access') # Login, File Access, AI Summary, AI Chat, Download, Admin Create
    access_status = db.Column(db.String(100), nullable=False) # Granted, Denied, Success, Error
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        user = User.query.filter_by(username=self.username).first()
        return {
            "id": self.id,
            "username": self.username,
            "role": user.role if user else "Unknown",
            "department": user.department if user else "Unknown",
            "file_name": self.file_name,
            "action_type": self.action_type,
            "access_status": self.access_status,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name}
