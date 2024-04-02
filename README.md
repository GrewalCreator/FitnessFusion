# Fitness Fusion
A Health and Fitness Club Management System that serves the diverse needs of club members, administrative staff and trainers.

Types of Members:
- Client
- Trainer
- Admin-Staff

What Can Clients Do?:
- Register and Login to their accounts, manage their personal profile
- Establish personal fitness goals [Goals Such as Weight and Goal Date] and other health metrics [Daily Calorie intake, steps, etc]
- Access a personalised Dashboard that tracks:
    - Excersize routines (Bar Graph to track more activity for the week)
    - Fitness Achivements (Highest Step Count in the week/month)
    - Health Statistics
- A Calendar allowing clients to book a session with a trainer or group fitness class


What Can Trainers Do?:
- Manage Their Own Schedule
- View Profiles of Members

What Can Admin-Staff Do?:
- Manage Room bookings
- Monitor Fitness Equipment Maintenance
- Update Group Class Schedules
- Oversee billing
- Process Payments for membership fees, personal training sessions, etc 


## Features

- 


## Development

### Error Codes
- 400 MISSING_ENTRY: Input Entry Missing
- 400 INVALID_DOB: Invalid Date of Birth, Ensure Format is YYYY-MM-DD
- 400 INVALID_PASSWORD: Invalid Password
- 400 INVALID_EMAIL: Invalid Email
- 400 INVALID_GENDER: Invalid Gender. Please Enter Male, Female, or Other (M, F, O)
- 400 INVALID_MEMBER_TYPE: Invalid Member Type. Expected: Client, Trainer, Admin-Staff
- 409 EMAIL_UNAVAILABLE: Email Unavailable, Already In Use

### Endpoints
Sample Input Can Be Found Here:
https://www.postman.com/telecoms-saganist-9479667/workspace/postconnect/request/19276775-2552fd9d-063d-43f8-9704-6e557e8c4a3f?tab=body

#### /addMembers
This endpoint is used to add new users to the database and should be used for registration purposes. 
Information Regarding the input parameters and expected output can be found [here](https://www.postman.com/telecoms-saganist-9479667/workspace/postconnect/request/19276775-2552fd9d-063d-43f8-9704-6e557e8c4a3f?tab=body) or using the link above