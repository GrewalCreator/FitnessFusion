import React from 'react';
import '../assets/listItem.css';

const ListItem = ({ data, labelMapping, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const formatBoolean = (value) => {
    return typeof value === 'boolean' ? value.toString() : value;
  };


  return (
    <div className="list-item" onClick={handleClick}>
      {labelMapping.map(({ label, key }) => (
        <div key={label} className="list-item-field">
          <span className="list-item-label">{label}:</span>
          <span className="list-item-value">{formatBoolean(data[key])}</span>
        </div>
      ))}
    </div>
  );
};

export default ListItem;
