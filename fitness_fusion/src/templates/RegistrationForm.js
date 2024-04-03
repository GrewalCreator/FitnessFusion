// RegistrationForm.js
import React from 'react';
import '../App.css';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dob: '',
      gender: '',
      memberType: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, for now, just log the state
    console.log(this.state);
  };

  render() {
    return (
      <div className="form-container">
        <h1>Registration</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={this.state.dob} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={this.state.gender} onChange={this.handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Member Type:</label>
            <select name="memberType" value={this.state.memberType} onChange={this.handleChange}>
              <option value="">Select</option>
              <option value="Client">Basic</option>
              <option value="x">Premium</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default RegistrationForm;