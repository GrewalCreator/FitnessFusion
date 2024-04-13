import React, { useState, useContext } from 'react';
import '../assets/trainerSchedulePage.css'
import { AuthContext } from '../Components/AuthContext';
import Navbar from '../Components/NavBar';

const TrainerSchedulePage = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('');
    const { email } = useContext(AuthContext);

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
                body: JSON.stringify({'email': email, 'startTime': dateTime, 'duration': duration, 'sessionType': 'private'})
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

            <button type="submit">Add Private Session Availability</button>
            </form>
        </div>
      </div>
    );
};

export default TrainerSchedulePage;
