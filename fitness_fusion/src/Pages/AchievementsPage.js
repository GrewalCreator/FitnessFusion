import Navbar from '../Components/NavBar';
import '../assets/achievementsPage.css'; 
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../Components/AuthContext'; 


function getColor(value) {
    const minValue = 0;
    const maxValue = 500; 
    
    const percentage = (value - minValue) / (maxValue - minValue);
    
    const red = Math.round(255 * (1 - percentage));
    const green = Math.round(255 * percentage);
    
    return `rgb(${red}, ${green}, 0)`;
}

  

const AchievementsPage = () => {
    const [deadlift, setDeadlift] = useState(0);
    const [squat, setSquat] = useState(0); 
    const [benchpress, setBenchpress] = useState(0); 


    const { email } = useContext(AuthContext); 

    const fetchFitnessAchievements = useCallback(async () => {
    try {
        const response = await fetch('/getAchievements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        setDeadlift(data[0][0]);
        setSquat(data[0][1]);
        setBenchpress(data[0][2]);
        
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }, [email]);
        


    useEffect(() => {
        fetchFitnessAchievements();
    }, [fetchFitnessAchievements]); 


    return (
    <div className="achievements-container">
        <Navbar />
        <h2>Achievements!</h2>
        <div className="icon-container"> 
        <div className="icon" id="deadlift" style={{ backgroundColor: getColor(deadlift) }}>
            <p>{deadlift}</p>
            <p>Deadlift PR</p>
        </div>
        <div className="icon" id="squat" style={{ backgroundColor: getColor(squat) }}>
            <p>{squat}</p>
            <p>Squat PR</p>
        </div>
        <div className="icon" id="benchpress" style={{ backgroundColor: getColor(benchpress) }}>
            <p>{benchpress}</p>
            <p>Benchpress PR</p>
        </div>
        </div>
    </div>
    );
};

export default AchievementsPage;
