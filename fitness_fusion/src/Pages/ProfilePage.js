import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');


  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/updateEmail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldEmail, newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update email');
      }

      const data = await response.json();
      setEmailMessage(data.message);
      setOldEmail('');
      setNewEmail('');
    } catch (error) {
      setEmailMessage('Failed to update email');
      console.error('Error updating email:', error.message);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldEmail, password, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      const data = await response.json();
      setPasswordMessage(data.message);
      setOldEmail('');
      setPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordMessage('Failed to update password');
      console.error('Error updating password:', error.message);
    }
  };


  return (
    <div>
      <Link to="/home">
        <button>Go to Home</button>
      </Link>
      <h1>Profile Page</h1>
      <div>
        <h2>Update Email</h2>
        <form onSubmit={handleEmailSubmit}>
          <label htmlFor="oldEmail">Old Email:</label>
          <input type="email" id="oldEmail" value={oldEmail} onChange={(e) => setOldEmail(e.target.value)} required /><br /><br />
          <label htmlFor="newEmail">New Email:</label>
          <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required /><br /><br />
          <button type="submit">Update Email</button>
        </form>
        <div id="emailMessage">{emailMessage}</div>
      </div>
      <div>
        <h2>Update Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password">Old Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><br /><br />
          <button type="submit">Update Password</button>
        </form>
        <div id="passwordMessage">{passwordMessage}</div>
      </div>
      <div>
        <h2>Delete User</h2>
      </div>
    </div>
  );
}

export default ProfilePage;
