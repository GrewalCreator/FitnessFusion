import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './templates/LandingPage';
import ProfilePage from './templates/ProfilePage';

function App() {
  const handleSetup = async () => {
    try {
      const response = await fetch('/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // You can include any data you want to send in the body
        body: JSON.stringify({ /* data */ })
      });

      if (!response.ok) {
        throw new Error('Failed to setup');
      }

      // Handle successful setup
    } catch (error) {
      console.error('Error setting up:', error.message);
    }
  };

  // Call handleSetup when App component mounts
  React.useEffect(() => {
    handleSetup();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
