import React, { useState } from 'react';
import './css/addCardModal.css';

const AddCardModal = ({ handleClose, handleAddCard }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSubmit = () => {
        // Perform validation if needed
        handleAddCard({ pan: cardNumber, expiryDate: expiryDate, userId: localStorage.getItem("userId") });
        handleClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <h2>Add New Card</h2>
                <div>
                    <label>Card Number:</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div>
                    <label>Expiry Date:</label>
                    <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
                <button onClick={handleSubmit}>Add Card</button>
            </div>
        </div>
    );
};

export default AddCardModal;
