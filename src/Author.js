import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from './BookCard'; // Assuming you have a BookCard component
import Navbar from './Navbar';

const Author = () => {
    const [categoryBooks, setCategoryBooks] = useState([]);

    const { id, name } = useParams();

    useEffect(() => {
        const fetchCategoryBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/author/books/${id}`);
                setCategoryBooks(response.data);
            } catch (error) {
                console.error('Error fetching category books:', error);
            }
        };

        fetchCategoryBooks();
    }, [id]);

    return (
        <div className="home-container">
            <Navbar/>
            <div className="category-page">
                <h2>Books in Category: {name}</h2>
                <div className="book-list">
                    {categoryBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Author;
