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
import TrainerPage from './Pages/TrainerPage';
import AdminPage from './Pages/AdminPage';
import GoalsPage from './Pages/GoalsPage';
import AchievementsPage from './Pages/AchievementsPage';
import TrainerSchedulePage from './Pages/TrainerSchedulePage';
import AdminGroupSchedulePage from './Pages/AdminGroupSchedulePage';
import NotFoundPage from './Pages/404NotFound';
import GroupSessionBookingPage from './Pages/GroupSessionBookingPage';
import PersonalSessionBookingPage from './Pages/PersonalSessionBooking';
import EquipmentPage from './Pages/EquipmentPage';

// Must be logged in to access these routes. Otherwise directed to login. Must also be the appropriate role
function PrivateRoute({ allowedRoles }) {
  const { isLoggedIn, role } = useContext(AuthContext);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/notFound" replace />;
  }

  return <Outlet />;
}



// If not logged in, go to '/', otherwise allow to pass (if logged in)
function AnonymousRoute({ isLoggedIn }) {
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}

function HomeRole() {
  const { role } = useContext(AuthContext);
  switch (role) {
    case 'Client':
      return <HomePage />;
    case 'Trainer':
      return <TrainerPage />;
    case 'Admin-Staff':
      return <AdminPage />;
    default:
      return <Navigate to="/notFound" replace />;
  }
}

function App() {

  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>

            <Route element={<PrivateRoute allowedRoles={['Client', 'Trainer', 'Admin-Staff']}/>}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/home" element={<HomeRole />} />
            </Route>

            {/* Client */}
            <Route element={<PrivateRoute allowedRoles={['Client']}/>}>
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/groupSessionBooking" element={<GroupSessionBookingPage />} />
              <Route path="/personalSessionBooking" element={<PersonalSessionBookingPage />} />
            </Route>

            {/* Trainer */}
            <Route element={<PrivateRoute allowedRoles={['Trainer']}/>}>
              <Route path="/trainer" element={<TrainerPage />} />
              <Route path="/trainerClientManagement" element={<TrainerClientPage />} />
              <Route path="/trainerSchedule" element={<TrainerSchedulePage />} />
            </Route>

            {/* Admin */}
            <Route element={<PrivateRoute allowedRoles={['Admin-Staff']}/>}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/groupSchedule" element={<AdminGroupSchedulePage />} />
              <Route path="/adminBillingManagement" element={<AdminBillingPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
            </Route>

            {/* Anonymous access */}
            <Route element={<AnonymousRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/*" element={<NotFoundPage />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}



export default App;
