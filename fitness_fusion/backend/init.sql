CREATE TABLE IF NOT EXISTS Members (
    MemberID SERIAL PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT UNIQUE NOT NULL,
    Password BYTEA NOT NULL,
    DOB DATE NOT NULL,
    Gender CHAR(1) NOT NULL,
    MemberType TEXT NOT NULL,
    JoinDate DATE DEFAULT CURRENT_DATE
);


CREATE TABLE IF NOT EXISTS Clients (
    MemberID INT NOT NULL UNIQUE,
    CurrentWeight INT NOT NULL DEFAULT 0,
    MonthlyAvgSteps INT NOT NULL DEFAULT 0,
<<<<<<< Updated upstream
    highestStepCount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
);


CREATE TABLE IF NOT EXISTS Goals(
=======
    HighestStepCount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Goals (
>>>>>>> Stashed changes
    GoalID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL,
    GoalType TEXT NOT NULL,  
    GoalTarget FLOAT NOT NULL,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE
);

<<<<<<< Updated upstream
=======

CREATE INDEX IF NOT EXISTS member_email_index ON Members (Email);
CREATE INDEX IF NOT EXISTS members_memberid_index ON Members (MemberID);
CREATE INDEX IF NOT EXISTS clients_memberid_index ON Clients (MemberID);
>>>>>>> Stashed changes
