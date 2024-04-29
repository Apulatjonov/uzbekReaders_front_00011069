// Statistics.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/statistics.css'; // Import CSS file for styling
import Navbar from './Navbar';

const Statistics = () => {
    const [overallStatistics, setOverallStatistics] = useState({});
    const [bookStatistics, setBookStatistics] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Fetch overall statistics
                const overallResponse = await axios.get('http://localhost:8086/api/v1/users/stats/' + localStorage.getItem("userId"));
                setOverallStatistics(overallResponse.data);

                // Fetch book statistics
                const bookResponse = await axios.get('http://localhost:8086/api/v1/book/stats/user/' + localStorage.getItem("userId"));
                setBookStatistics(bookResponse.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="statistics-container">
            <Navbar />
            <header className="statistics-header">
                <h1>Statistics</h1>
            </header>
            <main className="statistics-main">
                <div className="overall-statistics">
                    <h2>Overall Statistics</h2>
                    <div className="statistic">
                        <p>Total Books: {overallStatistics.totalBooks}</p>
                        <p>Total Reads: {overallStatistics.totalReadsNumber}</p>
                        <p>Total Reads Currently: {overallStatistics.totalCurrentlyReading}</p>
                        <p>Total Revenue: {overallStatistics.totalRevenue}</p>
                        <p>Total Expected Revenue: {overallStatistics.totalCurrentRevenue}</p>
                        <p>Total Views: {overallStatistics.totalViews}</p>
                        <p>Total Comments: {overallStatistics.totalComments}</p>
                        <p>Total Rates: {overallStatistics.totalRatesNumber}</p>
                        {/* Add more statistics here */}
                    </div>
                </div>
                <div className="book-statistics">
                    <h2>Book Statistics</h2>
                    <div className="book-list">
                        {bookStatistics.map((book, index) => (
                            <div className="book-item" key={index}>
                                <img src={book.imgUrl} alt={book.title} />
                                <div className="book-details">
                                    <h3>{book.title}</h3>
                                    <p>Author: {book.author}</p>
                                    <p>Reads: {book.readsNumber}</p>
                                    <p>Currently reading: {book.currentlyReading}</p>
                                    <p>Total revenue: {book.totalRevenue}</p>
                                    <p>Expected revenue: {book.currentRevenue}</p>
                                    <p>Views: {book.views}</p>
                                    <p>Comments: {book.comments}</p>
                                    <p>Rated by: {book.ratesNumber}</p>
                                    {/* Add more book statistics here */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="statistics-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Statistics;
