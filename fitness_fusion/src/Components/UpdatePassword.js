import React, { useState, useContext } from 'react';
import '../assets/popup.css';
import { AuthContext } from '../Components/AuthContext';

const UpdatePasswordPopup = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { logout, email } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email, "password": currentPassword, "newPassword": newPassword })
      });
  
      if (response.ok) {
        onClose();
        console.log('Password updated successfully');
        logout();
        alert("Password Successfully Updated. Please Login")
      } else {
        
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
  
        
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2 className="popup-heading">Update Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="popup-label">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="popup-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="popup-label">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="popup-input"
            />
          </div>
          <button type="submit" className="popup-button">Submit</button>
        </form>
        <button onClick={onClose} className="popup-button">Close</button>
      </div>
    </div>
  );
};

export default UpdatePasswordPopup;
