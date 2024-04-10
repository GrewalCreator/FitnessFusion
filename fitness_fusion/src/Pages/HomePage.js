import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import Navbar from '../Components/NavBar';

function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <Navbar />
            <h1>Welcome to the Home Page</h1>
            <p>This is where you'll gain access to the rest of the app!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
