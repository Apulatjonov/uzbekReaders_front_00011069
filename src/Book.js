import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { useParams } from 'react-router-dom';
import "./css/book.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Page from './Page';

const Book = () => {
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    
    const [hoveredRating, setHoveredRating] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [remainingChars, setRemainingChars] = useState(255);
    const [subscriptionActive, setSubscriptionActive] = useState(false); // Flag to indicate if subscription is active


    const { id } = useParams();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                var response ;
                if(localStorage.getItem("userId") != undefined){
                    response = await axios.get(`http://localhost:8086/api/v1/book/book/${id}/userId/${localStorage.getItem("userId")}`);
                }else{
                    response = await axios.get(`http://localhost:8086/api/v1/book/book/${id}`);
                }
                setBook(response.data);
                setComments(response.data.comments); // Assuming comments are part of the book object
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        const checkSubscription = async () => {
            if(localStorage.getItem("userId") != undefined){
                try {
                    const userId = localStorage.getItem('userId');
                    const response = await axios.get(`http://localhost:8086/api/v1/users/${userId}`);
                    if (response.data.subscriptionActive) {
                        // If paidTill is set, user has an active subscription
                        setSubscriptionActive(true);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }else{
                setSubscriptionActive(false);
            }
        };

        fetchBook();
        checkSubscription();
    }, [id]);

    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8086/api/v1/comments/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            toast.success('Comment deleted successfully!');
        } catch (error) {
            toast.error('Error deleting comment.');
        }
    };
    

    const renderStarRating = (score) => {
        const filledStars = Math.round(score);
        const emptyStars = 10 - filledStars;
    
        return (
            <div className="star-rating">
                {[...Array(filledStars)].map((_, index) => (
                    <span 
                        key={index} 
                        className={`star filled ${hoveredRating && hoveredRating > index ? 'hovered' : ''} ${selectedRating && selectedRating > index ? 'selected' : ''}`} 
                        onClick={() => handleRatingClick(index + 1)}
                        onMouseOver={() => handleHover(index + 1)}
                        onMouseOut={handleHoverOut}
                    >
                        &#9733;
                    </span>
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <span 
                        key={index} 
                        className={`star empty ${hoveredRating && hoveredRating > (filledStars + index) ? 'hovered' : ''} ${selectedRating && selectedRating > (filledStars + index) ? 'selected' : ''}`} 
                        onClick={() => handleRatingClick(filledStars + index + 1)}
                        onMouseOver={() => handleHover(filledStars + index + 1)}
                        onMouseOut={handleHoverOut}
                    >
                        &#9734;
                    </span>
                ))}
            </div>
        );
    };
    

    const handleCommentSubmit = async () => {
        try {
            if(!localStorage.getItem('userId')){
                window.location.href = '/login';
                return;
            }
            const comment = {
                userId : localStorage.getItem('userId'),
                body : newComment,
                bookId : id
            }

            if (comment.body.length > 255) {
                toast.warn("Comment should not exceed 255 characters!");
                return;
            }

            const response = await axios.post(`http://localhost:8086/api/v1/comments`, comment );
            setComments([...comments, response.data]);
            setNewComment('');
            setRemainingChars(255); // Reset remaining characters
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const handleReadClick = () => {
        window.location.href = `/book/${book.id}/page`;
    };

    const handleAuthor = () => {
        window.location.href = `/author/${book.authorId}/${book.authorName}`
    }

    const handleCategory = () => {
        window.location.href = `/category/${book.categoryId}/${book.categoryName}`;
    }

    const handleSubscribeClick = () => {
        if(localStorage.getItem("userId") != undefined){
            window.location.href = '/profile';
        }else{
            window.location.href = '/login';
        }
    }

    if (!book) {
        return <div>Loading...</div>;
    }

    const handleHover = (rating) => {
        if (!selectedRating) {
            setHoveredRating(rating);
        }
    };
    
    const handleHoverOut = () => {
        if (!selectedRating) {
            setHoveredRating(null);
        }
    };

    

    const handleRatingClick = async (rating) => {
        try {
            if (!localStorage.getItem('userId')) {
                window.location.href = '/login';
                return;
            }
            const rate = {
                userId: localStorage.getItem('userId'),
                bookId: id,
                rating: rating
            }
            const response = await axios.post(`http://localhost:8086/api/v1/book/rate`, rate );
            setBook({ ...book, score: response.data.score });
            setSelectedRating(rating);
            setHoveredRating(null); // Reset the hover state
        } catch (error) {
            if (error.response && error.response.status === 402) {
                toast.warn('Already rated!');
            }else{
                toast.error("Something went wrong!");
            }
        }
    };


    return (
        <div>
            <Navbar />
            <div className="book-container">
                <div className='book-picture'>
                <img src={book.imgUrl} alt={book.title} className='book-image'/>
                {/* Add rating section */}
                {localStorage.getItem("userId") && (
                        <section className='add-rating-section'>
                            <h3>Rate this book</h3>
                            {renderStarRating(selectedRating || book.score)}
                        </section>
                    )}
                {/* <h3>Price: {book.price}</h3> */}
                </div>
                <div className='book-details'>
                <h2>{book.title}</h2>
                    <p onClick={handleAuthor}>Author: {book.authorName}</p>
                    <p onClick={handleCategory}>Category: {book.categoryName}</p>
                    <p className='description'>Description: {book.description}</p>
                    {/* Render appropriate button based on subscription status */}
                    {subscriptionActive ? (
                        <button onClick={handleReadClick}>Read</button>
                    ) : (
                        <button onClick={handleSubscribeClick}>Subscribe</button>
                    )}
                    
                    {/* Comments section */}
            <section className='comments-section'>
                <h3>Comments</h3>
                <ul className="comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="comment-container">
                            <span className="comment-item"><strong>{comment.user}: </strong><span>{comment.body}</span></span>
                            {localStorage.getItem('userId') == comment.userId && (
                                <span onClick={() => handleCommentDelete(comment.id)} className="delete-comment-btn">Delete</span>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

                    {/* Add comment section */}
            {(localStorage.getItem("userId")) ? (
                <section className='add-comment-section'>
                    <div className="add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value);
                                setRemainingChars(255 - e.target.value.length); // Update remaining characters
                            }}
                            placeholder="Add your comment here..."
                            maxlength="255" // Limit characters
                        ></textarea>
                        <div className="char-counter">{remainingChars} characters remaining</div> {/* Display character counter */}
                        <button onClick={handleCommentSubmit}>Add Comment</button>
                    </div>
                </section>  
            ) : (
                <div>
                    <a href="/login" className='sign-in-link'>Sign in to leave a comment</a>
                </div>
            )}
                </div>
            </div>
            <ToastContainer />
            <footer className="home-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Book;
