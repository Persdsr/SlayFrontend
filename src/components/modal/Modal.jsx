import React from 'react';

const Modal = ({ title, content, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <span className="close-button" onClick={onClose}>
            ✖
          </span>
                </div>
                <div className="modal-body">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Modal;