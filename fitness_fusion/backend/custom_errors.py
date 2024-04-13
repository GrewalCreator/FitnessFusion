
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

BAD_INPUT = Error(400, "Bad Input Found. Check Data Types, Repeating Fields and negative/null Values", "BAD_INPUT")

INVALID_QUERY = Error(500, "Query Does Not Exist", "INVALID_QUERY")

PAYMENT_FAILED = Error(500, "Payment Failed. Please Try Again Later. If The Issue Is Not Resolved, Contact Technical Support at (123)-456-7890", "PAYMENT_FAILED")

DELETE_FAILED = Error(500, "Failed To Commit Deletion", "DELETE_FAILED")

SESSION_UNAVAILABLE = Error(409, "Session Is Unavailable", "SESSION_UNAVAILABLE")

GOAL_EXISTS = Error(409, "Goal Already Exists, Please Mark As Completed or Delete", "GOAL_EXISTS")

UPDATE_FAILED = Error(400, "Update Failed. Please Try Again", "UPDATE_FAILED")

ROOM_UNAVAILABLE = Error(400, "Room Unavailable","ROOM_UNAVAILABLE")

SESSION_NOT_FOUND = Error(404, "Session Not Found", "SESSION_NOT_FOUND")