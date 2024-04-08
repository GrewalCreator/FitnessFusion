import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      // Check if registration is successful
      if (response.ok) {
        // Redirect to login page
        navigate('/login');
      } else {
        // Check other possible responses (switch case)
        console.error('Registration unsuccessful:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      // Incase of sudden error, go back to landing page
      navigate("/")
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select name="member_type" value={formData.member_type} onChange={handleChange} required>
          <option value="">Select Member Type</option>
          <option value="client">Client</option>
          <option value="trainer">Trainer</option>
          <option value="admin-staff">Admin-Staff</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
