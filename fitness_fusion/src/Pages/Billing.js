import React, { useState, useEffect } from 'react';

function Billing() {
  const [payment, setPayment] = useState('');
  const [email, setEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  const [balance, setBalance] = useState(null);
  const [allClientBalances, setAllClientBalances] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/payAccountBalance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment: parseFloat(payment), email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const responseData = await response.json();
      console.log(responseData.message); // Log success message

      // After payment is successful, update the client balances
      getAllClientBalances();
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/getClientBalance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: searchName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const responseData = await response.json();
      setBalance(responseData.balance);
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

  const getAllClientBalances = async () => {
    try {
      const response = await fetch('/getAllClientBalance');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not in JSON format');
      }

      const responseData = await response.json();
      setAllClientBalances(responseData);
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

  useEffect(() => {
    getAllClientBalances();
  }, []); // Fetch all client balances when component mounts

  return (
    <div>
      <h2>Pay Account Balance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment Amount:</label>
          <input type="number" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">Pay Now</button>
      </form>

      <h2>Search Client Balance</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Search by Name:</label>
          <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        {balance !== null && (
          <div>
            <p>Balance Owed: {balance}</p>
          </div>
        )}
        <button type="submit">Search</button>
      </form>

      <h2>All Client Balances</h2>
      <ul>
        {allClientBalances.map((clientBalance, index) => (
          <li key={index}>{clientBalance}</li>
        ))}
      </ul>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Billing;
