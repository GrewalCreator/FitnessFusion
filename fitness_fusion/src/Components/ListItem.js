import React from 'react';
import '../assets/listItem.css';

const ListItem = ({ data, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="list-item" onClick={handleClick}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="list-item-field">
          <span className="list-item-label">{key}:</span>
          <span className="list-item-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default ListItem;
