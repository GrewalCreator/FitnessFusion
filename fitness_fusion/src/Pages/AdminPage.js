import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/NavBar';
import '../assets/adminPage.css'
import { AuthContext } from '../Components/AuthContext';

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);


  const handleViewClients = () => {
    navigate('/adminBillingManagement');
  };

  const handleAdjustSchedule = () => {
    navigate('/groupSchedule');
  };

  const handleEquipment = () => {
    navigate('/equipment')
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  );
};

export default AdminPage;

