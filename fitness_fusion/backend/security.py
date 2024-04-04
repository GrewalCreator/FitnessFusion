class Cryptography:
    def __init__(self, bcrypt) -> None:
        self.bcrypt = bcrypt

    def hash_password(self, password):
        
        hashed_password = self.bcrypt.generate_password_hash(password)
        hashed_password = hashed_password

        return hashed_password


    def verify_password(self, plain_text_password, hashed_password):
        plain_text_password_bytes = plain_text_password.encode('utf-8')

        
        if isinstance(hashed_password, str):
            hashed_password_bytes = hashed_password.encode('utf-8')
        elif isinstance(hashed_password, memoryview):
            hashed_password_bytes = bytes(hashed_password)
        else:
            raise ValueError("Invalid hashed password type")

        return self.bcrypt.check_password_hash(hashed_password_bytes.decode('utf-8'), plain_text_password_bytes)
        