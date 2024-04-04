
class Error(Exception):
    def __init__(self, code, message, name):
        self.code = code
        self.message = message
        self.name = name


    def to_dict(self):
        return {'code': self.code, 'message': self.message, 'name': self.name}
    
# Understood But Incomplete or Incorrect
MISSING_ENTRY = Error(400, "Input Entry Missing", "MISSING_ENTRY")
INVALID_DOB = Error(400, "Invalid Date of Birth, Ensure Format is YYYY-MM-DD", "INVALID_DOB")
INVALID_PASSWORD = Error(400, "Invalid Password", "INVALID_PASSWORD")
INVALID_EMAIL = Error(400, "Invalid Email", "INVALID_EMAIL")
INVALID_GENDER = Error(400, "Invalid Gender. Please Enter Male, Female or Other (M, F, O)", "INVALID_GENDER")
INVALID_MEMBER_TYPE = Error(400, "Invalid Member Type. Expected: Client, Trainer, Admin-Staff", "INVALID_MEMBER_TYPE")

EMAIL_UNAVAILABLE = Error(409, "Email Unavailable, Already In Use", "EMAIL_UNAVAILABLE")

MEMBER_ID_NOT_FOUND = Error(404, "Member ID Was Not Found", "MEMBER_ID_NOT_FOUND")

EMAIL_NOT_FOUND = Error(404, "Email Not Found", "EMAIL_NOT_FOUND")

BAD_INPUT = Error(400, "Bad Input Found. Check Data Types & Ensure There Are No Self Updating Values", "BAD_INPUT")