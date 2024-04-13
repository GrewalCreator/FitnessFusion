import React, { useState, useEffect } from 'react';
import '../assets/trainerSchedulePage.css';
import Navbar from '../Components/NavBar';

const AdminGroupSchedulePage = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainerEmail, setSelectedTrainerEmail] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomNumber, setRoomNumber] = useState(-1);

    useEffect(() => {
        fetchTrainers();
        fetchRooms();
    }, []);

    const fetchTrainers = async () => {
        try {
            const response = await fetch('/getAllTrainers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setTrainers(userData);
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error.message;
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Failed to fetch trainers:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch('/getAllRooms', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error.message;
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTime = `${date} ${time}:00`;

        try {
            if (duration < 30) {
                alert('Please allocate at least 30 minutes for a session');
                return;
            }
            if(roomNumber < 1){
                alert("Please Select A Room Number");
                return;
            }

            const response = await fetch('/addSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': selectedTrainerEmail,
                    'startTime': dateTime,
                    'duration': duration,
                    'sessionType': 'group',
                    'room': roomNumber
                })
            });

            if (response.ok) {
                console.log('Schedule submitted successfully!');
                alert('Private Session Availability Added');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error.message;
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Failed to submit schedule:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="schedule-container">
                <h2 id="title">Group Fitness Schedule</h2>
                <form className="session-form" onSubmit={handleSubmit}>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />

                    <label htmlFor="duration">Duration (in minutes):</label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />

                    <label htmlFor="user">Select Trainer:</label>
                    <select
                        id="user"
                        value={selectedTrainerEmail}
                        onChange={(e) => setSelectedTrainerEmail(e.target.value)}
                    >
                        <option value="">Select Trainer</option>
                        {trainers.map((trainer, index) => (
                            <option key={index} value={trainer[2]}>
                                {trainer[2]}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="room">Book a Room:</label>
                    <select
                        id="room"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    >
                        <option value="">Select Room Number</option>
                        {rooms.map((room, index) => (
                            <option key={index} value={room[0]}>
                                {room[0]}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Add Private Session Availability</button>
                </form>
            </div>
        </div>
    );
};

export default AdminGroupSchedulePage;
