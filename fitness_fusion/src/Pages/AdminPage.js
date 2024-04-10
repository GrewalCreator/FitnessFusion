import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavBar';
import '../assets/adminPage.css'

const AdminPage = () => {
  const navigate = useNavigate();


  const handleViewClientsClick = () => {
    navigate('/adminBillingManagement');
  };

  const handleAdjustScheduleClick = () => {
    navigate('/groupSchedule');
  };


  return (
    <div>
        <Navbar />
        <div className='admin-page'>
            <h2>Admin Page</h2>
            <div className="button-grid">
                <button onClick={handleViewClientsClick} className="rounded-button">View Clients</button>
                <button onClick={handleAdjustScheduleClick} className="rounded-button">Adjust Group Schedule</button>
            </div>  
        </div>
    </div>
  );
};

export default AdminPage;

