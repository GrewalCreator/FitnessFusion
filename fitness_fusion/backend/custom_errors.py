class Error:
    def __init__(self, code, message):
        self.code = code
        self.message = message

MISSING_ENTRY = Error(-4, "Input Entry Missing")
INVALID_DOB = Error(-3, "Invalid Date of Birth, Users Must Be At Least 14 Years of Age. Check Date Formatting if you are 14 Years or Older")
INVALID_PASSWORD = Error(-2, "Invalid Password")
INVALID_EMAIL = Error(-1, "Invalid Email")

