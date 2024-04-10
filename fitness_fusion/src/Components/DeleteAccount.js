import React, { useState, useContext } from 'react';
import '../assets/popup.css';
import { AuthContext } from '../Components/AuthContext';

const DeleteAccountPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logout } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/deleteMemberAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        onClose();
        console.log('Account deleted successfully');
        logout();
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
        <h2 className="popup-heading">Delete Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="popup-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="popup-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="popup-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="popup-input"
            />
          </div>
          <button type="submit" className="popup-button">Delete Account</button>
        </form>
        <button onClick={onClose} className="popup-button">Close</button>
      </div>
    </div>
  );
};

export default DeleteAccountPopup;
