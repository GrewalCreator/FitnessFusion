import React, {useContext} from 'react';
import { AuthContext, AuthProvider } from './Components/AuthContext';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegistrationPage from './Pages/RegistrationPage';
import ProfilePage from './Pages/ProfilePage';
import BillingPage from './Pages/BillingPage';
import AdminBillingPage from './Pages/AdminBillingPage';
import TrainerClientPage from './Pages/TrainerClientPage';

// Must be logged in to access these routes. Otherwise directed to login
function PrivateRoute() {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

// If not logged in, go to '/', otherwise allow to pass (if logged in)
function AnonymousRoute({ isLoggedIn }) {
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/billing" element={<BillingPage/>} />
              <Route path="/admin" element={<AdminBillingPage/>} />
              <Route path="/trainer" element={<TrainerClientPage/>} />
            </Route>

            <Route element={<AnonymousRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}


export default App;
