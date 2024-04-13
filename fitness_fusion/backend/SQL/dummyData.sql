
INSERT INTO Rooms (RoomNumber) VALUES
(101),
(102),
(103),
(104),
(105) ON CONFLICT (RoomNumber) DO NOTHING;


INSERT INTO Equipment (EquipmentName, isAvailable) VALUES
('Treadmill', true),
('Treadmill', true),
('Treadmill', false),
('Smith Machine', true),
('Rowing Machine', true),
('Rowing Machine', true),
('Hammer Strength Machine', true),
('Preacher Curl Bench', true),
('Preacher Curl Bench', true)