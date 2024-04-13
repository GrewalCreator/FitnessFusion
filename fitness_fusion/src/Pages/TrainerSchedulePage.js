import React, { useState, useContext, useEffect } from 'react';
import '../assets/trainerSchedulePage.css'
import { AuthContext } from '../Components/AuthContext';
import Navbar from '../Components/NavBar';

const TrainerSchedulePage = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const { email } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [roomNumber, setRoomNumber] = useState(-1);

    useEffect(() => {
        fetchRooms();
    }, []);


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
            if(duration < 30){
                alert("Please allocate at least 30 minutes for a session")
            }
            const response = await fetch('/addSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'email': email, 'startTime': dateTime, 'duration': duration, 'sessionType': 'private', room: roomNumber})
            });

            if (response.ok) {
                console.log('Schedule submitted successfully!');
                alert("Private Session Availability Added");
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
            <h2 id="title">Trainer Schedule</h2>
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

export default TrainerSchedulePage;
