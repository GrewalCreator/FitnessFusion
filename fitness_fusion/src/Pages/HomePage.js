import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Components/AuthContext';
import Navbar from '../Components/NavBar';
import '../assets/homePage.css'

function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleIconClick = (destination) => {
        navigate(destination);
    };

    return (
        <div>
            <Navbar />
            <h1>Welcome to your Fitness Journey!</h1>

            <div className="icon-container"> 
              
                <div className="icon" id = 'goals' onClick={() => handleIconClick('/goals')}>
                    <p>Set Your Goals</p>
                </div>


                <div className="icon" id = 'groupBooking' onClick={() => handleIconClick('/groupSessionBooking')}>
                    <p>Book A Class</p>
                </div>


                <div className="icon" id = 'personalBooking' onClick={() => handleIconClick('/personalSessionBooking')}>
                    <p>Book A Personal Fitness Session</p>
                </div>


                <div className="icon" id = 'achievements' onClick={() => handleIconClick('/achievements')}>
                    <p>Track Your Achievments</p>
                </div>

            </div>


            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
