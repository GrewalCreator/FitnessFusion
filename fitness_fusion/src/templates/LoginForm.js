import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import '../App.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating successful login
    // You can replace this with actual login logic
    if (email === 'example@example.com' && password === 'password') {
      // Redirect to profile page upon successful login
      navigate('/profile'); // Use navigate function to redirect
    } else {
      // Handle unsuccessful login
      console.log('Login failed');
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;