CREATE TABLE IF NOT EXISTS Members (
    MemberID SERIAL PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    DOB DATE NOT NULL,
    Gender CHAR(1) NOT NULL,
    MemberType TEXT NOT NULL,
    JoinDate DATE DEFAULT GETDATE()
)

ALTER TABLE Members
ADD CONSTRAINT valid_dateOfBirth CHECK (DOB <= GETDATE() AND EXTRACT(YEAR FROM age(GETDATE(), DOB)) >= 14);


CREATE TABLE IF NOT EXISTS Clients (
    MemberID INT NOT NULL UNIQUE,
    CurrentWeight INT NOT NULL,
    MonthlyAvgSteps INT NOT NULL,
    highestStepCount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
) 


CREATE TABLE IF NOT EXISTS Goals(
    GoalID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL,
    GoalType TEXT NOT NULL,  -- Weight-Loss, Steps per day, etc
    GoalTarget FLOAT NOT NULL,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
)

