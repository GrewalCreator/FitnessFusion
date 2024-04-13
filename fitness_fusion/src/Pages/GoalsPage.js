import React, { useState, useContext, useEffect, useCallback } from 'react';
import Navbar from '../Components/NavBar';
import '../assets/goalsPage.css';
import { AuthContext } from '../Components/AuthContext'; 
import ListItem from '../Components/ListItem';

function GoalsPage() {
    const [selectedExercise, setSelectedExercise] = useState(''); 
    const [goal, setGoal] = useState(''); 
    const [data, setData] = useState([[]]);

    
    const { email } = useContext(AuthContext); 

    const fetchGoals = useCallback(async () => {
      try {
        const response = await fetch('/getGoals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'email': email, 'isCompleted':false })
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }, [email]);
    


   useEffect(() => {
    fetchGoals();
  }, [fetchGoals]); 


    const handleSetGoal = async (e) => {
        e.preventDefault();

        if (!selectedExercise) {
          alert("Please select an exercise before submitting.");
          return; 
        }
        try {
          const response = await fetch('/setGoal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({'type': selectedExercise, 'value': goal, 'email': email})
          });
          
          if (response.ok) {
            console.log("Goal Added Successfully");
            setGoal('');
            alert('Goal Set Successfully');
            fetchGoals();
          } else {
            const errorData = await response.json(); 
            const errorMessage = errorData.error.message;
            alert(`Error: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Failed to set goal:', error)
          alert('Failed to set goal. Please try again later.');
        }
    };

    const handleDelete = async (item) => {
      try {
        const dateTime = new Date(item[2]);
        const formatDate = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(dateTime); 
    
        const formatTime = new Intl.DateTimeFormat('en-CA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }).format(dateTime);
    
        const formattedDateTime = `${formatDate} ${formatTime}`;
    
        const response = await fetch('/deleteGoal', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email": email, "type": item[0], 'target': item[1], 'dateTime': formattedDateTime })
        });
    
        if (response.ok) {
          console.log("Goal Deleted Successfully");
          setGoal('');
          alert('Goal Deleted Successfully');
          
        } else {
          const errorData = await response.json(); 
          const errorMessage = errorData.error.message;
          alert(`Error: ${errorMessage}`);
        }
      
      } catch (error) {
        console.error('Error Deleting Goal', error);
      }
    };
    

    const handleMarkComplete = async (item) => {
      try {

        const dateTime = new Date(item[2]);
        const formatDate = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(dateTime); 
    
        const formatTime = new Intl.DateTimeFormat('en-CA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }).format(dateTime);
    
        const formattedDateTime = `${formatDate} ${formatTime}`;
        
        const response = await fetch('/completeGoal', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email": email, "type": item[0], 'target': item[1], 'dateTime': formattedDateTime })
        });
    
        if (response.ok) {
          console.log("Goal Completed Successfully");
          setGoal('');
          alert('Goal Completed Successfully');
          
        } else {
          const errorData = await response.json(); 
          const errorMessage = errorData.error.message;
          alert(`Error: ${errorMessage}`);
        }
      
      } catch (error) {
        console.error('Error Completing Goal', error);
      }
    };

    const labelMapping = [
      { key: 0, label: 'Exercise' },
      { key: 1, label: 'Target' },
      { key: 2, label: 'Time Created' },
    ];
    
    
    return (
        <div>
            <Navbar />
            <h2>Set Your Goals!</h2>
            <div className="goals-container">
                <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                    <option value="" disabled hidden>Select A Exercise</option>
                    <option value="deadlift">Deadlift</option>
                    <option value="squat">Squat</option>
                    <option value="benchpress">Benchpress</option>
                </select>
                <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Enter Goal" />
                <button onClick={handleSetGoal}>Set Goal</button>
                <div>
                  {data.map((item, index) => (
                      <div key={index} className="list-item-container">
                          <ListItem key={index} data={item} labelMapping={labelMapping} />
                          <div>
                              <button className="delete" onClick={() => handleDelete(item)}>Delete</button>
                              <button onClick={() => handleMarkComplete(item)}>Mark as Complete</button>
                          </div>
                      </div>
                  ))}
              </div>


            </div>
            

        </div>
    );
}

export default GoalsPage;
