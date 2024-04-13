import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../Components/NavBar';
import ListItem from '../Components/ListItem';
import '../assets/equipmentPage.css';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);

  const fetchEquipment = useCallback(async () => {
    try {
      const response = await fetch('/getEquipment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error.message;
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleRequestMaintenance = async (item) => {
    try {
        const response = await fetch('/toggleEquipment', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: false, id: item[0] })
        });

        if (response.ok) {
            fetchEquipment();
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.error.message;
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
      console.error('Error updating equipment status:', error);
    }
  };

  const handleCompleteMaintenance = async (item) => {
    try {
      const response = await fetch('/toggleEquipment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: true, id: item[0] })
      });

      if (response.ok) {
        fetchEquipment();
    } else {
        const errorData = await response.json();
        const errorMessage = errorData.error.message;
        alert(`Error: ${errorMessage}`);
    }
    } catch (error) {
      console.error('Error updating equipment status:', error);
    }
  };

  const labelMapping = [
    { key: 0, label: 'Equipment ID' },
    { key: 1, label: 'Equipment Name' },
    { key: 2, label: 'isFunctional' },
  ];

  return (
    <div className="equipment-container">
      <Navbar />
      <h2>Available Equipment</h2>
      <div>
        {equipment.map((item, index) => (
          <div key={index} className="list-equipment-container">
            <ListItem key={index} data={item} labelMapping={labelMapping} />
            <div>
              {item[2] ? (
                <button className="availability" id='isAvailable' onClick={() => handleRequestMaintenance(item)}>
                  Request Maintenance
                </button>
              ) : (
                <button className="availability" id='notAvailable' onClick={() => handleCompleteMaintenance(item)}>
                  Complete Maintenance
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentPage;
