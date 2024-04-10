import React from 'react';
import ListView from '../Components/ListView'; 
import Navbar from '../Components/NavBar';




const TrainerClientPage = () => {

  const labelMapping = [
    { key: 0, label: 'FirstName' },
    { key: 1, label: 'LastName' },
    { key: 2, label: 'Email' },
    { key: 3, label: 'Gender' }
  ];


  return (

    <div className="trainer-client-management">
      <Navbar />
      <h2>Trainer Client Management</h2>
      <ListView endpoint={"/searchClientsByName"} method = 'POST' labelMapping={labelMapping}/>
    </div>
  );
};

export default TrainerClientPage;
