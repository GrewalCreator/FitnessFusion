import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavBar';
import '../assets/adminPage.css'

const AdminPage = () => {
  const navigate = useNavigate();


  const handleViewClients = () => {
    navigate('/adminBillingManagement');
  };

  const handleAdjustSchedule = () => {
    navigate('/groupSchedule');
  };

  const handleEquipment = () => {
    navigate('/equipment')
  };


  return (
    <div>
        <Navbar />
        <div className='admin-page'>
            <h2>Admin Page</h2>
            <div className="button-grid">
                <button onClick={handleViewClients} className="rounded-button">View Clients Billing</button>
                <button onClick={handleAdjustSchedule} className="rounded-button">Adjust Group Schedule</button>
                <button onClick={handleEquipment} className="rounded-button">Manage Equipment</button>
            </div>  
        </div>
    </div>
  );
};

export default AdminPage;

