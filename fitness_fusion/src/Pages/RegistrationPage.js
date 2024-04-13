import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/registrationPage.css'

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: '',
    member_type: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/addMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
  
        
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to Login:', error)
      alert('Failed to register. Please try again later.');
      navigate("/");
    }
  };

  return (
    <div className="form-container">
    <h2 id = "title">Registration</h2>
    
    <form className="registration-form" onSubmit={handleSubmit}>
      <label htmlFor="first_name">First Name:</label>
      <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
  
      <label htmlFor="last_name">Last Name:</label>
      <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
  
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
  
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
  
      <label htmlFor="date_of_birth">Date of Birth:</label>
      <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
  
      <label htmlFor="gender">Gender:</label>
      <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
  
      <label htmlFor="member_type">Member Type:</label>
      <select id="member_type" name="member_type" value={formData.member_type} onChange={handleChange} required>
        <option value="">Select Member Type</option>
        <option value="client">Client</option>
        <option value="trainer">Trainer</option>
        <option value="admin-staff">Admin-Staff</option>
      </select>
  
      <button type="submit">Register</button>
    </form>
    <p className="login">Have An Account? <span onClick={() => navigate('/login')}>Login!</span></p>
  </div>
  


  );
};

export default RegistrationPage;
