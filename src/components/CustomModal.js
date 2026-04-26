import React from 'react';

function CustomModal({ isOpen, title, message, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="custom-modal-title">{title}</h2>

        <p className="custom-modal-message">{message}</p>

        {/* Optional extra content (like WAF ID / Key) */}
        {children}

        <button className="custom-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CustomModal;
