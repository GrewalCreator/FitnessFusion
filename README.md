# Fitness Fusion
A Health and Fitness Club Management System that serves the diverse needs of club members, administrative staff and trainers.

Types of Members:
- Client
- Trainer
- Admin-Staff


## How to Run
- add a confg.ini file containing the password to your database. A template can be found in the repo as 'exampleConfig.ini'



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

- Clients can securely register and login
- User email maintained in cache
- View and pay account balance
- Update profile data
- Delete accounts
- Admin & Trainers can view list of client details
- 


## Development

### Endpoints
Sample Input Can Be Found Here:
https://www.postman.com/telecoms-saganist-9479667/workspace/postconnect/request/19276775-2552fd9d-063d-43f8-9704-6e557e8c4a3f?tab=body

#### /addMembers
This endpoint is used to add new users to the database and should be used for registration purposes. 
Information Regarding the input parameters and expected output can be found [here](https://www.postman.com/telecoms-saganist-9479667/workspace/postconnect/request/19276775-2552fd9d-063d-43f8-9704-6e557e8c4a3f?tab=body) or using the link above

#### /login
This endpoint is used to verify the users login credentials. Using addMembers, the password was hashed and stored in the database as binary data. /login will check against the hashed password to verify the correct password. Information Regarding the input parameters and expected output can be found [here](https://www.postman.com/telecoms-saganist-9479667/workspace/postconnect/request/19276775-2552fd9d-063d-43f8-9704-6e557e8c4a3f?tab=body) or using the link above

#### /updateEmail
This endpoint allows the user to update their email linked to their account. Checks are run to ensure the email is not already in use as the email should be unique to the account.

#### /updatePassword
This endpoint allows the user to update their password to their account. User must provide the unique email linked to their account, the original password and the new password they would like to set.

#### /getAllMembers
This is an endpoint designed to retrive all members from the database. All information such as name, email, gender and dates will be returned, excluding password.
