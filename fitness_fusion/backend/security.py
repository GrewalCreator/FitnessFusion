import bcrypt

def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    return hashed_password


def verify_password(plain_text_password, hashed_password):
    plain_text_password_bytes = plain_text_password.encode('utf-8')

    
    if isinstance(hashed_password, str):
        hashed_password_bytes = hashed_password.encode('utf-8')
    elif isinstance(hashed_password, memoryview):
        hashed_password_bytes = bytes(hashed_password)
    else:
        raise ValueError("Invalid hashed password type")

    return bcrypt.checkpw(plain_text_password_bytes, hashed_password_bytes)