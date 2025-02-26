import React from 'react';
import '../styles/index.css';

const AuthModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        {content}
      </div>
    </div>
  );
};

export default AuthModal;
