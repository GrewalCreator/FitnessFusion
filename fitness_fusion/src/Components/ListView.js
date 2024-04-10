import React, { useState } from 'react';
import ListItem from './ListItem';
import '../assets/listView.css';

const ListView = ({ endpoint, method, labelMapping }) => { 
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = () => {
    fetchClients(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'name': searchTerm})
      });

      if (response.ok) {
        const responseData = await response.json();
        const transformedData = responseData.map(item => {
          const transformedItem = {};
          labelMapping.forEach(mapping => {
            transformedItem[mapping.label] = item[mapping.key];
          });
          return transformedItem;
        });
        setData(transformedData);
      } else {
        const errorData = await response.json(); 
        const errorMessage = errorData.error.message;
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
  };

  return (
    <div className="list-view">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button> 
      </div>
      <div className="list-items">
        {data.map((item, index) => (
          <ListItem key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
