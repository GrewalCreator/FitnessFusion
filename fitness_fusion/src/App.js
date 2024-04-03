import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import LandingPage from './templates/LandingPage';
import ProfilePage from './templates/ProfilePage';

function App() {
  return (
    <Router>
      <Routes> {
        <Route path="/" element={<LandingPage />} />}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;