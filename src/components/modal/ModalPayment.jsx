import React from 'react';

const ModalPayment = ({
                          title, content, onClose
                      }) => {


    return (
        <div className="modal-overlay">
            <div className="modal-payment-content">
                <div className="modal-header">
                    <h2>Оплата: {title}</h2>
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

export default ModalPayment;