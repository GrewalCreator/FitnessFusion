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
    AccountBalance BIGINT NOT NULL DEFAULT 0,
    SessionIDs INT[] DEFAULT ARRAY[]::INT[],
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS Goals (
    GoalID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL,
    GoalType TEXT NOT NULL,  
    GoalTarget FLOAT NOT NULL,
    DateCreated TIMESTAMP(0) DEFAULT LOCALTIMESTAMP,
    isCompleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Rooms (
    RoomNumber INT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Equipment (
    EquipmentID SERIAL PRIMARY KEY,
    EquipmentName TEXT NOT NULL,
    isAvailable BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS WorkoutSessions (
    SessionID SERIAL PRIMARY KEY,
    MemberID INT NOT NULL,
    StartTime TIMESTAMP(0) NOT NULL,
    Duration_Minutes INT NOT NULL DEFAULT 30,
    isBooked BOOLEAN NOT NULL DEFAULT FALSE,
    SessionType TEXT NOT NULL,
    RoomNumber INT,
    Participants INT DEFAULT 0,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE,
    CONSTRAINT unique_member_start_time UNIQUE (MemberID, StartTime)
);




CREATE INDEX IF NOT EXISTS member_email_index ON Members (Email);
CREATE INDEX IF NOT EXISTS members_memberid_index ON Members (MemberID);
CREATE INDEX IF NOT EXISTS clients_memberid_index ON Clients (MemberID);