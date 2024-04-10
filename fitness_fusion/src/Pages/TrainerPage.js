import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/trainerPage.css'
import Navbar from '../Components/NavBar';

const TrainerPage = () => {
  const navigate = useNavigate();

  const handleViewClientsClick = () => {
    navigate('/trainerClientManagement');
  };

  const handleAdjustScheduleClick = () => {
    navigate('/trainerSchedule');
  };

  return (
    <div>
        <Navbar />
        <div className="trainer-page">
            <h2>Trainer Page</h2>
            <div className="button-grid">
                <button onClick={handleViewClientsClick} className="rounded-button">View Clients</button>
                <button onClick={handleAdjustScheduleClick} className="rounded-button">Adjust Personal Schedule</button>
        
            </div>
        </div>
    </div>
    
  );
};

export default TrainerPage;
