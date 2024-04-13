import React, { useState, useContext, useEffect, useCallback } from 'react';
import Navbar from '../Components/NavBar';
import ListItem from '../Components/ListItem';
import '../assets/groupSession.css'
import { AuthContext } from '../Components/AuthContext';

const GroupSessionBookingPage = () => {

  const [data, setData] = useState([]);
  const { email } = useContext(AuthContext);

  const labelMapping = [
    { key: 0, label: 'SessionID' },
    { key: 1, label: 'Trainer Name' },
    { key: 2, label: 'Start Time' },
    { key: 3, label: 'Duration (minutes)' },
    { key: 4, label: 'Room Number' },
    { key: 5, label: 'Participants' },
  ];

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/getAllSessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'group', email: email })
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to Fetch Group Session Data:', error)
    }
  }, [email]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]); 

  const handleBooking = async (item) => {
    try {
      const response = await fetch('/bookSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionID: item[0], email: email })
      });

      if (response.ok) {
        alert("Session Booked Successfully")
        fetchSessions();
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to Book Group Session:', error)
    }
  };
 
  return (
    <div>
        <Navbar/>
        <div className='group-container'>
            <h1>Group Session Booking Page</h1>
            <div>
                  {data.map((item, index) => (
                      <div key={index} className="list-session-container">
                          <ListItem key={index} data={item} labelMapping={labelMapping} />
                          <div>
                              <button className="book" onClick={() => handleBooking(item)}>Book</button>
                          </div>
                      </div>
                  ))}
              </div>
        </div>
    </div>
  );
};

export default GroupSessionBookingPage;
