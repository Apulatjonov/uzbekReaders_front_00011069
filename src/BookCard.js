import React, { useState } from 'react';
import "./css/myLibrary.css";

const BookCard = ({ book, index }) => {
  const [date, setDate] = useState();

  const handleBookClick = (id) => {
    window.location.href = `/book/${id}`; // Navigate to Book page with the corresponding book ID
  };

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

  return (
    <div className="book-item" onClick={() => handleBookClick(book.id)}>
      <img src={book.imgUrl} alt={book.title} />
      <h2>{book.title}</h2>
      <h3>{book.authorName}</h3>
      {book.score != undefined && renderStarRating(book.score)}
      {handleDate()}
      {publishedDate()}
    </div>
  );
};

export default BookCard;
