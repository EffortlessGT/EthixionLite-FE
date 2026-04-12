import React, { useState } from 'react';
import ethixion from '../assets/img/ethixion.svg';

const EthixionAlert = ({ msg }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="ethixion-overlay">
      <div className="ethixion-popup">
        <h2 className="ethixion-title">
          <img src={ethixion} alt="Ethixion"></img> Ethixion Alerts
        </h2>
        <p className="ethixion-message">{msg}</p>
        <button className="ethixion-btn" onClick={() => setVisible(false)}>
          OK
        </button>
      </div>
    </div>
  );
};

export default EthixionAlert;
