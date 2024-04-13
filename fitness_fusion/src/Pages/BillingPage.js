import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Components/AuthContext'; 
import '../assets/billingPage.css'
import Navbar from '../Components/NavBar';


const BillingPage = () => {
  const [paymentAmount, setPaymentAmount] = useState(''); 
  const [balance, setBalance] = useState(0);
  const [paymentMade, setPaymentMade] = useState(false); 
  const { email } = useContext(AuthContext); 

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/getClientBalanceByEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        const formattedBalance = data.toLocaleString();
        setBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [email, paymentMade]); 

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/payAccountBalance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'payment': parseFloat(paymentAmount), email }) 
      });

      if (response.ok) {
        console.log('Payment successful');
        setPaymentMade(!paymentMade); 
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message; 
        alert(`Error: ${errorMessage}`);
      }
      
      setPaymentAmount(''); 
      
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="billing-container">
        <h2>Account Payment</h2>
        <div className="balance-info">
          <p>Current Balance Due: ${balance}</p>
        </div>
        <form className="payment-form" onSubmit={handlePaymentSubmit}>
          <label>
            Enter Payment Amount:
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />
          </label>
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default BillingPage;
