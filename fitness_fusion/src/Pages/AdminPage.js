import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [clientBalances, setClientBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientBalances = async () => {
      try {
        const response = await fetch('/getClientBalance');
        if (!response.ok) {
          throw new Error('Failed to fetch client balances');
        }
        const data = await response.json();
        setClientBalances(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
     
      }
    };

    fetchClientBalances();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Client Balances</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {clientBalances.map((client) => (
            <tr key={client.email}>
              <td>{client.email}</td>
              <td>{client.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
