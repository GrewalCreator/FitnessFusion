 // LandingPage.js
import React from 'react';
import RegistrationForm from './RegistrationForm.js';
import LoginForm from './LoginForm.js';
import '../App.css';
 
class LandingPage extends React.Component {
constructor(props) {
    super(props);
    this.state = {
    showRegistrationForm: false,
    showLoginForm: false
    };
}

handleRegisterClick = () => {
    this.setState({ showRegistrationForm: true, showLoginForm: false });
};

handleLoginClick = () => {
    this.setState({ showLoginForm: true, showRegistrationForm: false });
};

render() {
    return (
    <div className="container">
        <h1>Fitness Fusion!</h1>
        <p>Do you want to register or login?</p>
        <button onClick={this.handleRegisterClick}>Register</button>
        <button onClick={this.handleLoginClick}>Login</button>
        
        {this.state.showRegistrationForm && <RegistrationForm />}
        {this.state.showLoginForm && <LoginForm />}
    </div>
    );
}
}

export default LandingPage;