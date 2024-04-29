import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import "./css/profile.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import AddCardModal from './AddCardModal';

const Profile = () => {
    const [user, setUser] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        cards: [],
        paidTill: ''
    });
    const [newCard, setNewCard] = useState('');
    const [editing, setEditing] = useState(false);
    const { userId } = useParams();
    const [cards, setCards] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            if(localStorage.getItem("userId") == undefined){
                window.location.href = '/';
            }
            try {
                const response = await axios.get('http://localhost:8086/api/v1/users/' + localStorage.getItem("userId"));
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        const fetchCards = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/card/${localStorage.getItem("userId")}/cards`);
                setCards(response.data);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        fetchUser();
        fetchCards();
    }, []);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAddCard = async (card) => {
        try {
            await axios.post('http://localhost:8086/api/v1/card/addCard', card);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    const handleRemoveCard = (index) => {
        const updatedCards = [...user.cards];
        updatedCards.splice(index, 1);
        setUser({ ...user, cards: updatedCards });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.post('http://localhost:8086/api/v1/users/fillProfile', user);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
        setEditing(false);
    };

    const handleMakePayment = async () => {
        if (!selectedCard) {
            toast.warn("Please select a card.");
            return;
        }
    
        // Check if the selected card has enough balance
        const selectedCardDetails = cards.find(card => card.id === selectedCard);
        if (!selectedCardDetails) {
            toast.error("Selected card details not found.");
            return;
        }
    
        if (selectedCardDetails.balance < paymentAmount) {
            toast.warn("Insufficient balance on the selected card.");
            return;
        }
    
        try {
            await axios.post('http://localhost:8086/api/v1/payment/pay', {amount: paymentAmount, cardId: selectedCardDetails.id, userId: localStorage.getItem("userId")});
            toast.success("Payment successful!");
            window.location.reload();
        } catch (error) {
            console.error("Error making payment:", error);
            toast.error("Failed to make payment. Please try again.");
        }
    };
    

    const handleAddNewCard = () => {
        setShowAddCardModal(true);
    };

    function cutDecimalPlaces(number) {
        // Convert the number to a string
        const numString = number.toString();
    
        // Split the string by the dot (.) character
        const parts = numString.split('.');
    
        // If there are no decimal places or only one character after the dot, return the original number
        if (parts.length < 2 || parts[1].length <= 2) {
            return number;
        }
    
        // Concatenate the first part with the first two characters of the second part
        return parseFloat(parts[0] + '.' + parts[1].substring(0, 2));
    }

    const handleCardSelect = (cardId) => {
        setSelectedCard(cardId);
    };

    const handleCloseModal = () => {
        setShowAddCardModal(false);
        window.location.reload();
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h2>Profile</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!editing}
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                        disabled={!editing}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                        disabled={!editing}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        disabled={!editing}
                    />
                </div>
                {editing ? (
                    <button onClick={handleSaveChanges} className='button'>Save Changes</button>
                ) : (
                    <button onClick={() => setEditing(true)} className='button'>Edit Profile</button>
                )}
                <div className="cards-section">
                    <h3>Available Cards</h3>
                    <div className="card-list">
                        {cards.map(card => (
                            <div key={card.id} className={`card-item ${selectedCard === card.id ? 'selected' : ''}`} onClick={() => handleCardSelect(card.id)}>
                                <div className="card-details">
                                    <p>PAN: {card.panMask}</p>
                                    <p>Expiry Date: {card.expiryDate}</p>
                                    <p>Balance: {cutDecimalPlaces(card.balance)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddNewCard}>Add New Card</button>
                </div>
                <div className="payment-section">
                    <h2>Monthly subscription fee: 5$</h2>
                    <h3>Make Payment</h3>
                    <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter payment amount"
                    />
                    {user.subscriptionActive ? (
                    <label>Active subscription till: {user.paidTill}</label>   
                    ) : (<label>Inactive</label>)}
                    <button onClick={handleMakePayment}>Make Payment</button>
                </div>
            </div>
            {showAddCardModal && (
                <AddCardModal handleClose={handleCloseModal} handleAddCard={handleAddCard} />
            )}
            <ToastContainer />
        </div>
    );
};

export default Profile;
