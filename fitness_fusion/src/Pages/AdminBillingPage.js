import React from 'react';
import ListView from '../Components/ListView'; 
import Navbar from '../Components/NavBar';

const AdminBillingPage = () => {

  const labelMapping = [
    { key: 0, label: 'FirstName' },
    { key: 1, label: 'LastName' },
    { key: 2, label: 'Email' },
    { key: 3, label: 'Balance' }
  ];

  return (
    <div className="admin-billing-management">
      <Navbar />
      <h2>Admin Billing Management</h2>
      <ListView endpoint={"/getClientBalanceByName"} method='POST' labelMapping={labelMapping} />
    </div>
  );
};

export default AdminBillingPage;
