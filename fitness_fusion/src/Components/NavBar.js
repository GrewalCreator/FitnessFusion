import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/navBar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <nav className="navbar">
      <div className="brand" onClick={() => handleNavigate('/home')}>
        FitnessFusion
      </div>
      <div className="links-container">
        <div className="link" onClick={() => handleNavigate('/home')}>Home</div>
        <div className="link" onClick={() => handleNavigate('/billing')}>Billing</div>
        <div className="link" onClick={() => handleNavigate('/admin')}>Admin</div>
        <div className="link" onClick={() => handleNavigate('/trainer')}>Trainer</div>
        
        <div className="link" onClick={() => handleNavigate('/profile')}>Profile</div>
      </div>
    </nav>
  );
};

export default Navbar;
