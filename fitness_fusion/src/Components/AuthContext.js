import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage or set it to null
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
  });

  const [email, setEmail] = useState(() => {
    return JSON.parse(localStorage.getItem('email')) || null;
  });

  // Set Variable and remove cache
  const setAuth = (loggedIn, userEmail) => {
    setIsLoggedIn(loggedIn);
    setEmail(userEmail);
    localStorage.setItem('isLoggedIn', JSON.stringify(loggedIn));
    localStorage.setItem('email', JSON.stringify(userEmail));
  };

  const logout = () => {
    setAuth(false, null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
