import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import "./css/myLibrary.css";
import BookCard from './BookCard'; // Assuming you have a BookCard component

const MyLibrary = () => {
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [ratedBooks, setRatedBooks] = useState([]);

    useEffect(() => {
        const fetchCurrentlyReading = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/book/currentlyReading/${localStorage.getItem("userId")}`);
                setCurrentlyReading(response.data);
            } catch (error) {
                console.error('Error fetching currently reading books:', error);
            }
        };

        const fetchRecentlyViewed = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/book/recentlyViewed/${localStorage.getItem("userId")}`);
                const sortedBooks = response.data.sort((a, b) => new Date(b.accessedAt) - new Date(a.accessedAt));
                setRecentlyViewed(sortedBooks);
            } catch (error) {
                console.error('Error fetching recently viewed books:', error);
            }
        };

        const fetchRatedBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/book/rated/${localStorage.getItem("userId")}`);
                setRatedBooks(response.data);
            } catch (error) {
                console.error('Error fetching rated books:', error);
            }
        };

        fetchCurrentlyReading();
        fetchRecentlyViewed();
        fetchRatedBooks();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="library-container">
                <h2>My Library</h2>
                <div className="section">
                    <h3>Currently Reading</h3>
                    <div className="book-list horizontal-scroll">
                        {currentlyReading.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                    {currentlyReading.length === 0 && <p>No books currently being read.</p>}
                </div>
                <div className="section">
                    <h3>Recently Viewed</h3>
                    <div className="book-list horizontal-scroll">
                        {recentlyViewed.map(book => (
                            <BookCard key={book.id} book={book} index={book.index} />
                        ))}
                    </div>
                    {recentlyViewed.length === 0 && <p>No recently viewed books.</p>}
                </div>
                <div className="section">
                    <h3>Rated Books</h3>
                    <div className="book-list horizontal-scroll">
                        {ratedBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                    {ratedBooks.length === 0 && <p>No rated books.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyLibrary;
