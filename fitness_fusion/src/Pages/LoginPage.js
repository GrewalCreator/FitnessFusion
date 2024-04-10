import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Components/AuthContext'; 
import '../assets/loginPage.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      
      if (response.ok) {
        setAuth(true, formData.email);
        navigate('/home');
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
  
        
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to Login:', error)
      alert('Failed to login. Please try again later.');
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <h2 id="title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p className="signup">Don't Have An Account? <span onClick={() => navigate('/register')}>Sign Up!</span></p>
    </div>
  );
};

export default LoginPage;
