import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage or set it to null
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
  });

  const [email, setEmail] = useState(() => {
    return JSON.parse(localStorage.getItem('email')) || null;
  });

  const [role, setRole] = useState(() => {
    return JSON.parse(localStorage.getItem('role')) || null;
  });


  // Set Variable and remove cache
  const setAuth = useCallback((loggedIn, userEmail) => {
    setIsLoggedIn(loggedIn);
    setEmail(userEmail);
    localStorage.setItem('email', JSON.stringify(userEmail));
    localStorage.setItem('isLoggedIn', JSON.stringify(loggedIn));
  }, []);
  
  const logout = useCallback(() => {
    setAuth(false, null, '', null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }, [setAuth]);
  
  

  const fetchMemberType = useCallback(async (email) => {
    try {
      const response = await fetch('/getMemberType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        setRole(data[0]);
        localStorage.setItem('role', JSON.stringify(data[0]));
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error.message;
        alert(`Error: ${errorMessage}`);
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch Role Data:', error);
    }
  }, [logout]);

  useEffect(() => {
    if (email) {
      fetchMemberType(email);
    }
  }, [email, fetchMemberType]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, setAuth, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
