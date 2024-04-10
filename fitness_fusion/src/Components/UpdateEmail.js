import React, { useState, useContext } from 'react';
import { AuthContext } from '../Components/AuthContext'; 
import '../assets/popup.css';

const UpdateEmailPopup = ({ onClose }) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logout, email } = useContext(AuthContext); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/updateEmail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'oldEmail': email, 'newEmail': newEmail, 'password': password})
      });
      
      
      if (response.ok) {
        console.log("Email Updated Successfully")
        logout();
        alert("Email Successfully Upated. Please Login")
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message;
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to Login:', error)
      alert('Failed to update email. Please try again later.');
      
    }
  };

  return (
    <div class="popup">
      <div class="popup-content">
        <h2 class="popup-heading">Update Email</h2> 
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label htmlFor="newEmail" className="popup-label">New Email:</label> 
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              class="popup-input" 
            />
          </div>
          <div class="form-group">
            <label htmlFor="Password" className="popup-label">Password:</label> 
            <input
              type="password"
              id="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              class="popup-input"
            />
          </div>
          <button type="submit" class="popup-button">Submit</button> 
        </form>
        <button onClick={onClose} class="popup-button">Close</button> 
      </div>
    </div>
  );
};

export default UpdateEmailPopup;
