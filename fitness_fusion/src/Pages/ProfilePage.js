import React, { useState } from 'react';

function ProfilePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      const data = await response.json();
      setMessage(data.message);
      setEmail('');
      setPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage('Failed to update password');
      console.error('Error updating password:', error.message);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
        <label htmlFor="password">Old Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />
        <label htmlFor="newPassword">New Password:</label>
        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><br /><br />
        <button type="submit">Update Password</button>
      </form>
      <div id="message">{message}</div>
    </div>
  );
}

export default ProfilePage;