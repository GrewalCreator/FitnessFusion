import React, { useState, useContext } from 'react';
import { AuthContext } from '../Components/AuthContext';
import Navbar from '../Components/NavBar';
import UpdateEmailPopup from '../Components/UpdateEmail';
import UpdatePasswordPopup from '../Components/UpdatePassword';
import DeleteAccountPopup from '../Components/DeleteAccount';

const ProfilePage = () => {
  const { email } = useContext(AuthContext);
  const [showUpdateEmailPopup, setShowUpdateEmailPopup] = useState(false);
  const [showUpdatePasswordPopup, setShowUpdatePasswordPopup] = useState(false);
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);

  const handleUpdateEmail = () => {
    setShowUpdateEmailPopup(true);
  };

  const handleUpdatePassword = () => {
    setShowUpdatePasswordPopup(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountPopup(true);
  };

  return (
    <div>
      <Navbar />
      <section>
        <h2>Email:</h2>
        <p>{email}</p>
        <button onClick={handleUpdateEmail}>Update Email</button>
      </section>
      <section>
        <h2>Password:</h2>
        <p>***********</p>
        <button onClick={handleUpdatePassword}>Update Password</button>
      </section>
      <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteAccount}>Delete Account</button>

      {showUpdateEmailPopup && <UpdateEmailPopup onClose={() => setShowUpdateEmailPopup(false)} />}
      {showUpdatePasswordPopup && <UpdatePasswordPopup onClose={() => setShowUpdatePasswordPopup(false)} />}
      {showDeleteAccountPopup && <DeleteAccountPopup onClose={() => setShowDeleteAccountPopup(false)} />}
    </div>
  );
};

export default ProfilePage;
