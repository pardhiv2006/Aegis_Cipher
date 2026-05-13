import base64

def simulate_abe_encrypt(content):
    """
    Simulates ABE encryption by Base64 encoding the content.
    In a real ABE system, this would involve complex pairings and attribute-based keys.
    """
    return base64.b64encode(content.encode('utf-8')).decode('utf-8')

def simulate_abe_decrypt(encrypted_content, user_role, user_dept, file_role_policy, file_dept_policy):
    """
    Simulates ABE decryption logic.
    Decryption succeeds only if user attributes satisfy the file's access policy.
    Admin bypasses all checks.
    """
    if user_role == 'Admin':
        return base64.b64decode(encrypted_content).decode('utf-8')
    
    # Check Role
    # Policy can be "All" or a specific role
    role_match = (file_role_policy == 'All' or user_role == file_role_policy)
    
    # Check Department
    # Policy can be "All" or a specific department
    dept_match = (file_dept_policy == 'All' or user_dept == file_dept_policy)
    
    if role_match and dept_match:
        return base64.b64decode(encrypted_content).decode('utf-8')
    
    return None # Access Denied
