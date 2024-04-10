import React from 'react';
import '../assets/listItem.css'

const ListItem = ({ data }) => {
  return (
    <div className="list-item">
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
