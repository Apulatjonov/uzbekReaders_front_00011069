import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/myBooks.css'; // Import CSS file for styling
import Navbar from './Navbar';
import BookCard from './BookCard'; // Import BookCard component
import "./css/myBooks.css"
import { toast, ToastContainer } from 'react-toastify';
import MyBookCard from './MyBookCard';

const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // State to control the visibility of the upload modal
    const [newBookData, setNewBookData] = useState({
        title: '',
        author: {},
        category: {},
        imgUrl: '',
        userId: localStorage.getItem("userId"),
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userId] = localStorage.getItem("userId");

    useEffect(() => {
        const fetchAuthorsAndCategories = async () => {
            try {
                const authorResponse = await axios.get('http://localhost:8086/api/v1/author/all');
                setAuthors(authorResponse.data);

                const categoryResponse = await axios.get('http://localhost:8086/api/v1/book/categories');
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching authors and categories:', error);
            }
        };

        fetchAuthorsAndCategories();
    }, []);

    const handleAuthorChange = (e) => {
        console.log(e.target.value);
        console.log(authors)
        let auth = { "fullName": e.target.value };
        for (let i = 0; i < authors.length; i++) {
            // console.log(authors[i].id + ": " + e.target.value)
            if (authors[i].id == e.target.value) {
                auth = authors[i];
                break;
            }
        }
        console.log(auth);
        setNewBookData({
            ...newBookData, author: auth
        });
    };

    const handleCategoryChange = (e) => {
        let cate = { "name": e.target.value };
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == e.target.value) {
                cate = categories[i];
                break;
            }
        }
        setNewBookData({
            ...newBookData, category: cate
        });
    };

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/book/myBooks/${localStorage.getItem("userId")}`);
                setMyBooks(response.data);
            } catch (error) {
                console.error('Error fetching my books:', error);
            }
        };

        fetchMyBooks();
    }, []);

    const toggleBtn = () => {
        if (!isUploadModalOpen) {
            setIsUploadModalOpen(true);
        }
    }

    const handleUploadModalOpen = () => {
        setIsUploadModalOpen(true);
    };

    const handleUploadModalClose = () => {
        setIsUploadModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBookData({ ...newBookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send new book data to the backend
            await axios.post('http://localhost:8086/api/v1/book/addBook', newBookData);
            // Close the modal and refresh the list of my books
            setIsUploadModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading new book:', error);
            toast.error(error);
        }
    };

    return (
        <div className="my-books-container">
            <Navbar />
            <header className="my-books-header">
                <h1>My Books</h1>
            </header>
            <main className="my-books-main">
                {myBooks.length === 0 && (
                    <h1 className='notFound'>No books available!</h1>
                )}
                <div className="book-list">
                    {myBooks.map((book, index) => (
                        <MyBookCard key={book.id} book={book} />
                    ))}
                </div>
                <br />
                <button onClick={toggleBtn}>Upload</button>
            </main>
            {isUploadModalOpen && (
                <div>
                    <div className="modal-overlay"> {/* Overlay */}
                        <div className="upload-modal">
                            <div className="modal-content">
                                <span className="close">&times;</span>
                                <h2>Upload New Book</h2>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="title" placeholder="Title" value={newBookData.title} onChange={handleInputChange} />
                                    <input type="text" name="author" placeholder="Author" value={newBookData.author.fullName} onChange={handleAuthorChange} />
                                    <input type="text" name="category" placeholder="Category" value={newBookData.category.name} onChange={handleCategoryChange} />
                                    <input type="text" name="imgUrl" placeholder="Image URL" value={newBookData.imgUrl} onChange={handleInputChange} />
                                    <div className="dropdown">
                                        <select className="dropdown-select" name="author" value={newBookData.author} onChange={handleAuthorChange}>
                                            <option value="">Select Author</option>
                                            {authors.map((author) => (
                                                <option className='dropdown-option' key={author.id} value={author.id}>{author.fullName}</option>
                                            ))}
                                        </select>
                                        <select className="dropdown-select" name="category" value={newBookData.category} onChange={handleCategoryChange}>
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        <br />
                                        <input type="text" name="description" placeholder="Description..." value={newBookData.description} onChange={handleInputChange} />
                                        <button type="submit">Submit</button>
                                        <button onClick={handleUploadModalClose}>Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
            <footer className="my-books-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MyBooks;
