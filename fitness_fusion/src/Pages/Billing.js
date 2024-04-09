import React, { useState } from 'react';

function Billing() {
  const [payment, setPayment] = useState('');
  const [email, setEmail] = useState('');
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
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default Billing;
