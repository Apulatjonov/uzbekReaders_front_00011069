import React, { useState } from 'react';
import "./css/myBookCard.css";
import axios from 'axios';

const MyBookCard = ({ book, index }) => {
    const [date, setDate] = useState();
    const [isUploadPageOpen, setIsUploadPageOpen] = useState(false);
    const [pageData, setPageData] = useState({
        text: '',
        pageNumber: '',
    });

    const handleDate = () => {
        if (book.accessedAt != undefined) {
            const accessedDate = new Date(Date(book.accessedAt));
            const dayOfMonth = accessedDate.getDate(); // Get the day of the month
            const monthIndex = accessedDate.getMonth(); // Get the month index
            const monthName = getMonthName(monthIndex);
            return (<div>
                <p>Accessed at:{dayOfMonth} {monthName}</p>
            </div>
            );
        }
    }

    const handleAddPage = () => {
        if (!isUploadPageOpen) {
            setIsUploadPageOpen(true);
        }
    }

    const handleClosePageUpload = () => {
        setIsUploadPageOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPageData({ ...pageData, [name]: value });
    };

    const publishedDate = () => {
        if (book.publishedDate != undefined) {
            const publishedDate = new Date(Date(book.publishedDate));
            const dayOfMonth = publishedDate.getDate(); // Get the day of the month
            const monthIndex = publishedDate.getMonth(); // Get the month index
            const monthName = getMonthName(monthIndex);
            return (<div>
                <p>Published at:{dayOfMonth} {monthName}</p>
            </div>
            );
        }
    }

    const handleCloseForm = () => {
        setIsUploadPageOpen(false);
    }

    const handleSubmit = async (e) => {
        try {
            
            const response = await axios.post('http://localhost:8086/api/v1/book/page', {
                bookId: book.id,
                content: e.target[0].value,
                pageNumber: book.totalPages + 1
            });
            console.log('Page added successfully:', response.data);
            e.preventDefault();
            // Close the modal
            // setIsUploadPageOpen(false);
            // Clear the input fields
            // setPageContent('');
        } catch (error) {
            console.error('Error adding page:', error);
            e.preventDefault()
        }


        setIsUploadPageOpen(false);
    };

    function getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    const renderStarRating = (score) => {
        const filledStars = Math.round(score); // Number of filled stars
        const emptyStars = 10 - filledStars; // Number of empty stars

        return (
            <div className="star-rating">
                {[...Array(filledStars)].map((_, index) => (
                    <span key={index} className="star">&#9733;</span>
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={index} className="star">&#9734;</span>
                ))}
            </div>
        );
    };

    // console.log(book);

    return (
        <div>
            <div className="book-item">
                <img src={book.imgUrl} alt={book.title} />
                <h2>{book.title}</h2>
                <h3>{book.authorName}</h3>
                {book.score != undefined && renderStarRating(book.score)}
                {handleDate()}
                {publishedDate()}
                <button onClick={handleAddPage}>Add page</button>
            </div>
            {isUploadPageOpen && (
                <div className="upload-page-popup upload-modal">
                    <div className='upload-modal'>
                        <div className='modal-content'>
                            <span className="close" onClick={handleClosePageUpload}>&times;</span>
                            <h2>{book.title}</h2>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="pageText">Page Text:</label>
                                <textarea
                                    id="pageText"
                                    name="text"
                                    value={pageData.text}
                                    onChange={handleInputChange}
                                    maxLength={400}
                                />
                                <label htmlFor="pageNumber">Page Number: {book.totalPages != null ? book.totalPages + 1 : 1}</label>
                                <button type="submit">Submit</button>
                                <button onClick={handleClosePageUpload}>Close</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookCard;
