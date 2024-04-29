import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './css/home.css'; // Import CSS file for styling
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import BookCard from './BookCard'; // Assuming you have a BookCard component

const Home = () => {
    const [books, setBooks] = useState([]); // State to store books data

    const [categoryBooks, setCategoryBooks] = useState({});
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchVisible, setSearchVisible] = useState(false);
    

    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [newBooks, setNewBooks] = useState([]);

    useEffect(() => {
        // Function to fetch books data from backend
        const fetchBooks = async () => {
            try {
                // Make GET request to backend API
                const response = await axios.get('http://localhost:8086/api/v1/book/books'); // Replace with your backend API endpoint
                setBooks(response.data); // Update books state with data from backend

                
                // // Get unique categories
                // const uniqueCategories = [...new Set(books.map(book => book.category))];
                // setCategories(uniqueCategories);

                // // Create categorized books object
                // const categorizedBooks = {};
                // uniqueCategories.forEach(category => {
                //     categorizedBooks[category] = books.filter(book => book.category === category)[0]; // Get the first book for each category
                // });
                // setCategoryBooks(categorizedBooks);


                // Filter books based on different criteria
                const featured = books.filter(book => book.score > 7);
                // const trendy = books.filter(book => book.trendy);
                const latest = books.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)).slice(0, 5); // Get 5 latest books

                setFeaturedBooks(featured);
                // setTrendyBooks(trendy);
                setNewBooks(latest);

            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        // Call fetchBooks function when component mounts
        fetchBooks();
    }, []);

    useEffect(() => {
        const uniqueCategories = [...new Set(books.map(book => book))];
        setCategories(uniqueCategories);

        const categorizedBooks = {};
        uniqueCategories.forEach(category => {
            const bookForCategory = books.find(book => book.categoryId === category.categoryId);
            if (bookForCategory) {
                categorizedBooks[category] = bookForCategory;
            }
        });
        setCategoryBooks(categorizedBooks);

    }, [books]);

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

    const handleBookClick = (id) => {
        window.location.href = `/book/${id}`; // Navigate to Book page with the corresponding book ID
    };

    const handleCategoryClick = (id, name) => {
        window.location.href = `/category/${id}/${name}`;
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8086/api/v1/book/searchBook/${searchText}`);
            setSearchResults(response.data);
            setSearchVisible(true);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSearchVisible(true);
            } else {
                toast.error('No result!');
            }
        }
    };

    return (
        <div className="home-container">
            <Navbar/>
            <header className="home-header">
                <h1>Welcome to UzbekReads</h1>
                <p>Your go-to destination for books!</p>
            </header>
            <main className="home-main">
            <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for books..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                {searchVisible && (<section className="search-results">
                    <h2>Search Results</h2>
                    {searchResults.length == 0 && (
                        <h4>No results!</h4>
                    )}
                    <div className="book-list">
                        {searchResults.length > 0 && searchResults.map((book, index) => (
                            <div className="book-item" key={index} onClick={() => handleBookClick(book.id)}>
                                <img src={book.imgUrl} alt={book.title} />
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                                {renderStarRating(book.score)}
                            </div>
                        ))}
                    </div>
                </section>) }

                <section className="featured-books">
                    <h2>All Books</h2>
                    <div className="book-list">
                        {/* Map through books array and display book items */}
                        {books.map((book, index) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </section>
                <section className="category-books">
                    <h2>Category Based</h2>
                    <div className="category-list shadowed-div">
                        <div className="horizontal-scroll">
                            {categories.map((category, index) => (
                                <div key={index} className="category-item" onClick={() => handleCategoryClick(category.categoryId, category.categoryName)}>
                                    <img src={category?.imgUrl} alt={category?.title} />
                                    <h4>{category.categoryName}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <ToastContainer />
            <footer className="home-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
