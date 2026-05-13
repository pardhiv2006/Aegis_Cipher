
import random

# Department-Specific Data
DEPT_THEMES = {
    'AI': {
        'name': 'Artificial Intelligence',
        'topics': ['Machine Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'Robotics'],
        'projects': ['Smart Traffic Optimization', 'Health-AI Diagnostic System', 'Autonomous Drone Navigation'],
        'labs': ['NVIDIA Deep Learning Lab', 'Robotics Simulation Center'],
        'equipment': ['DGX A100 Server', 'Raspberry Pi 4 Model B', 'Jetson Nano Kits', 'Lidar Sensors'],
        'faculty': ['Dr. Sharma', 'Dr. Reddy', 'Prof. Gupta']
    },
    'CSE': {
        'name': 'Computer Science & Engineering',
        'topics': ['Operating Systems', 'Database Management', 'Computer Networks', 'Cloud Computing', 'Cybersecurity'],
        'projects': ['Distributed File System', 'Blockchain Voting App', 'E-commerce Microservices'],
        'labs': ['Advanced Networking Lab', 'Software Development Hub'],
        'equipment': ['Cisco Routers', 'Blade Servers', 'Network Analyzers', 'UPS Systems'],
        'faculty': ['Dr. Khan', 'Prof. Verma', 'Dr. Singh']
    },
    'Civil': {
        'name': 'Civil Engineering',
        'topics': ['Structural Engineering', 'Soil Mechanics', 'Surveying', 'Fluid Mechanics', 'Transportation'],
        'projects': ['Smart Bridge Monitoring', 'Sustainable Housing Design', 'Dam Overflow Analysis'],
        'labs': ['Concrete Testing Lab', 'Geotechnical Analysis Lab'],
        'equipment': ['Total Station', 'UTM Machine', 'Concrete Mixers', 'Theodolite'],
        'faculty': ['Dr. Iyer', 'Prof. Malhotra', 'Dr. Joshi']
    },
    'Mechanical': {
        'name': 'Mechanical Engineering',
        'topics': ['Thermodynamics', 'Manufacturing Processes', 'CAD/CAM', 'Heat Transfer', 'Mechatronics'],
        'projects': ['Solar Powered Vehicle', 'Automated Sorting Arm', 'Hydraulic Brake Optimization'],
        'labs': ['Thermal Engineering Lab', 'Production Technology Lab'],
        'equipment': ['CNC Machine', '3D Printers', 'Lathe Machines', 'Boilers'],
        'faculty': ['Dr. Bose', 'Prof. Nair', 'Dr. Chatterjee']
    }
}

def generate_student_content(dept, type_key):
    theme = DEPT_THEMES[dept]
    topics = theme['topics']
    
    if type_key == 'Notes':
        return f"""
{theme['name']} - Student Notes

Subject: {topics[0]} Fundamentals

Key Topics:
- Introduction to {topics[0]}
- {topics[1]} Overview
- {topics[2]} Architecture

Key Concepts:
- Modern engineering enables automated decision-making
- Systems mimic human logic in {dept} domains
- Scalability is crucial for {topics[0]} implementation
"""
    elif type_key == 'Assignment':
        return f"""
{theme['name']} - Assignment Report

Assignment: Weekly Challenge #4
Topic: {topics[1]} Implementation

Problem Statement:
1. Explain the role of {topics[2]} in modern industry.
2. Design a flowchart for {topics[0]} processing.

Submission Deadline: 20th May
Grading Rubric: Logic (10), Documentation (5), Presentation (5)
"""
    elif type_key == 'Project':
        project_name = theme['projects'][0]
        return f"""
{theme['name']} - Project Report

Project Title: {project_name}

Technologies Used:
- {topics[0]}
- {topics[1]}
- {theme['equipment'][0]}

Objectives:
- Enhance system efficiency by 15%
- Implement real-time monitoring
- Reduce operational overhead

Current Status: Phase 2 Documentation Completed
"""
    elif type_key == 'Syllabus':
        return f"""
{theme['name']} - Course Syllabus

Course: Advanced {topics[0]}
Semester: VI

Unit 1: Introduction to {topics[1]}
Unit 2: Deep dive into {topics[2]}
Unit 3: Application of {topics[0]} in {dept}

Prescribed Books:
- {dept} Core Theory by {theme['faculty'][0]}
- Industry Standards for {topics[0]}
"""
    elif type_key == 'Exam':
        return f"""
{theme['name']} - Exam Preparation Guide

Focus Areas:
- Chapter 4: {topics[0]} Design
- Chapter 7: {topics[1]} Security
- Case Study: {theme['projects'][0]}

Strategy:
- Review previous 5 years papers
- Focus on {topics[2]} diagrams
- Practice {topics[0]} numericals
"""
    elif type_key == 'Guide':
        return f"""
{theme['name']} - Study Guide

This guide provides a comprehensive overview of {topics[0]} in the context of {theme['name']}.
It is designed to help students master the core principles and practical applications.
"""
    return f"Default {dept} Student Content for {type_key}"

def generate_faculty_content(dept, type_key):
    theme = DEPT_THEMES[dept]
    topics = theme['topics']

    if type_key == 'Marks':
        return f"""
{theme['name']} - Internal Marks Report

Course: {topics[0]}

Student Name | Assignment 1 | Midterm | Attendance | Total
-------------|--------------|---------|------------|------
Rajesh C.    | 18/20        | 25/30   | 95%        | 43/50
Anita P.     | 19/20        | 28/30   | 98%        | 47/50
Kevin D.     | 15/20        | 22/30   | 88%        | 37/50

Faculty Remarks: Good progress in {topics[1]} modules.
"""
    elif type_key == 'Attendance':
        return f"""
{theme['name']} - Attendance Analysis

3rd Year Statistics:
- Section A: 92%
- Section B: 88%

Attendance Insights:
- Higher engagement in {topics[0]} labs
- Lower attendance during {topics[2]} theory sessions

Recommendations:
- Conduct interactive {topics[1]} workshops
- Monthly parent-teacher communication
"""
    elif type_key == 'Planning':
        return f"""
{theme['name']} - Semester Academic Plan

Month 1:
- {topics[0]} Core Concepts
- Toolchain Setup
- Preliminary Quiz

Month 2:
- {topics[1]} Advanced Modules
- Guest Lecture by Industry Experts

Activities:
- {dept} Tech Fest
- Internal Assessment Cycle 1
- Workshop on {topics[2]}
"""
    elif type_key == 'Questions':
        return f"""
{theme['name']} - Question Bank (Strictly Confidential)

Section A (2 Marks):
1. Define {topics[0]}.
2. What is the primary use of {topics[1]}?

Section B (10 Marks):
3. Explain the architecture of {theme['projects'][0]}.
4. Discuss the impact of {topics[2]} on {dept} engineering.

Note: Important for Final Semester Evaluation.
"""
    elif type_key == 'Research':
        return f"""
{theme['name']} - Faculty Research Publication

Principal Investigator: {theme['faculty'][0]}
Title: Advancements in {topics[0]} using {topics[1]}

Abstract:
This study explores the synergy between {topics[2]} and modern {dept} systems.

Journal: International {dept} Review
Status: Under Peer Review
Impact Factor: 4.2
"""
    elif type_key == 'Minutes':
        return f"""
{theme['name']} - Minutes of Faculty Meeting
Meeting Date: 12th May 2026
Agenda: Curriculum update for {topics[0]}.
"""
    return f"Default {dept} Faculty Content for {type_key}"

def generate_lab_content(dept, type_key):
    theme = DEPT_THEMES[dept]
    topics = theme['topics']

    if type_key == 'Manual':
        return f"""
{theme['name']} - Laboratory Manual

Experiment: Analysis of {topics[0]}

Objective:
To determine the efficiency of {topics[1]} under varying loads.

Procedure:
1. Calibrate the {theme['equipment'][0]}
2. Apply input signal from {topics[2]} source
3. Record output parameters

Expected Result:
Verification of {dept} standard laws.
"""
    elif type_key == 'Experiment':
        return f"""
{theme['name']} - Lab Experiment Data Log

Experiment ID: EXP-742
Hardware Used: {theme['equipment'][0]}

Readings:
- Test 1 Accuracy: 94%
- Test 2 Efficiency: 89%

Observations:
- {topics[0]} influence was significant
- System stability maintained during {topics[1]} peak
"""
    elif type_key == 'Hardware':
        return f"""
{theme['name']} - Hardware Configuration Report

Installed Assets:
- {theme['equipment'][0]}
- Secondary {topics[0]} Controller
- High-Speed Link for {topics[1]}

Configuration:
1. Initialization at 220V
2. Safety Interlock Verified
3. Sensor Sync with {dept} Central Hub
"""
    elif type_key == 'Inventory':
        return f"""
{theme['name']} - Inventory Registry

Location: {theme['labs'][0]}

Asset | Quantity | Status | Warranty
------|----------|--------|---------
{theme['equipment'][0]} | 15 | Operational | 2027
{theme['equipment'][1]} | 8 | Under Repair | 2026
Standard Kits | 50 | Active | N/A

Verified by: Lab Superintendent
"""
    elif type_key == 'Health':
        return f"""
{theme['name']} - System Health Log
Status: ONLINE
All {dept} systems operating within normal parameters.
"""
    elif type_key == 'Safety':
        return f"""
{theme['name']} - Laboratory Safety Protocol
Guidelines for using {theme['equipment'][0]} in {theme['labs'][0]}.
"""
    return f"Default {dept} Lab Content for {type_key}"

def generate_hod_content(dept, type_key):
    theme = DEPT_THEMES[dept]
    topics = theme['topics']

    if type_key == 'Placement':
        return f"""
{theme['name']} - Placement Statistics

Academic Year: 2025-26
Total Students: 120
Placed: 105 (87%)

Highest CTC: 24 LPA
Average CTC: 8.5 LPA

Top Recruiters:
- Google (AI/ML Roles)
- L&T ({dept} Division)
- Tata Motors
- Microsoft

Trend: 20% increase in {topics[0]} specializations.
"""
    elif type_key == 'Budget':
        return f"""
{theme['name']} - Departmental Budget Report

Allocated: ₹25,00,000
Utilized: ₹18,50,000
Remaining: ₹6,50,000

Expenditure Breakdown:
- Lab Modernization ({topics[0]}): 40%
- Faculty Development: 15%
- Student Workshops: 20%
- Recurring Costs: 25%
"""
    elif type_key == 'Strategy':
        return f"""
{theme['name']} - Strategic Growth Plan

Key Goals:
1. Achieve Tier-1 Research Status in {topics[0]}
2. 100% Internship conversion for {topics[1]} projects
3. Industry Tie-up for {theme['labs'][0]}

Initiatives:
- Certification program in {topics[2]}
- Joint research with International Universities
"""
    elif type_key == 'Performance':
        return f"""
{theme['name']} - Faculty Performance Evaluation

Evaluated Faculty: {theme['faculty'][0]}
Rating: 4.8 / 5
"""
    elif 'Results' in type_key:
        return f"""
{theme['name']} - Semester Result Analytics
Department: {dept} Engineering
Subject: Advanced {topics[0]}

Student Internal Performance Record:
- Student ID 101 achieved 18/20 in Assignment 1, 28/30 in the Mid-Term, with 94% Attendance.
- Student ID 102 achieved 15/20 in Assignment 1, 24/30 in the Mid-Term, with 88% Attendance.
- Student ID 103 achieved 19/20 in Assignment 1, 29/30 in the Mid-Term, with 97% Attendance.

Subject Wise Performance Analysis:
- {topics[0]} Performance: 95% Success Rate
- {topics[1]} Performance: 88% Success Rate
- {topics[2]} Performance: 92% Success Rate

Observation: High attendance in {topics[0]} labs correlates directly with the superior assignment scores recorded in Phase 1.
"""
    elif 'Audit' in type_key:
        return f"""
{theme['name']} - Department Attendance Audit
Subject Coverage: {topics[0]} and {topics[1]}

Detailed Attendance Breakdown:
- 1st Year Batch A: 92.5% Attendance Recorded
- 2nd Year Batch B: 88.2% Attendance Recorded
- 3rd Year Batch C: 94.8% Attendance Recorded
- 4th Year Batch D: 85.0% Attendance Recorded

Critical Actions for Faculty:
- Issue warning letters to 12 students with attendance below 75%.
- Implement incentive points for 100% attendance in {topics[0]} theory sessions.
- Review attendance logs for {topics[2]} elective.
"""
    return f"Default {dept} HOD Content for {type_key}"

def generate_admin_content(type_key):
    if 'Security_Reports' in type_key:
        return f"""
Aegis Security Audit - Executive Report

Security Status: PROTECTED
Active Threat Vectors Detected: 0
Intercepted Access Violations: 42

Recent Integrity Checks:
- 02:30 AM: Database Integrity Verified (Status: GREEN)
- 05:15 AM: SSL Certificate Renewal Check (Status: ACTIVE)
- 09:00 AM: User Attribute Re-calibration (Status: SYNCED)

Conclusion: The ABE ecosystem is operating within expected security parameters.
"""
    elif 'Server_Configuration' in type_key:
        return f"""
University Master Server Configuration

Active Application Services:
- Aegis Flask API Gateway on Port 5001
- React Frontend Admin Console on Port 5175
- Attribute-Based Encryption Engine: Active

Hardware Resource Allocation:
- Processor: 16 Core Infrastructure
- System Memory: 64GB ECC RAM
- Storage Architecture: 2TB NVMe RAID Array
"""
    elif 'Database_Backup' in type_key:
        return f"""
Database Persistence & Backup Status

Last Successful Synchronization: 12 May 2026, 03:00 AM
Data Volume: 1.25 GB Secure Payload
Retention Policy: 30-Day Rolling Window

Backup Nodes:
- Primary Node: Local Secure RAID-1 Storage
- Secondary Node: Encrypted Cloud Vault B Instance
"""
    elif 'System_Logs' in type_key:
        return f"""
Aegis Master System Event Logs

Event 01: 10:00:01 - Admin_User performed DB_RECOVERY_LOAD - Result: SUCCESS
Event 02: 10:15:20 - HOD_AI_Node performed SECURE_FILE_WRITE - Result: SUCCESS
Event 03: 10:30:45 - External_Probe performed ATTR_ABE_PROBE - Result: TERMINATED

System Health: 144 days stable uptime.
"""
    elif 'User_Access_Records' in type_key:
        return f"""
Enterprise Identity & Access Registry

Registered Users: 1,240
Active Roles: Student, Faculty, Lab Assistant, HOD, Admin
Active Depts: AI, CSE, Civil, Mechanical

Audit Summary:
- No unauthorized role escalations detected.
- MFA compliant users: 95%
"""
    return f"Default Admin Content for {type_key}"
