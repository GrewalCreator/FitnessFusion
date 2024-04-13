
INSERT INTO Rooms (RoomNumber, isAvailable) VALUES
(101, true),
(102, true),
(103, true),
(104, true),
(105, true) ON CONFLICT (RoomNumber) DO NOTHING;
