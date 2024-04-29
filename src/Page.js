import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import './css/page.css';

const Page = () => {
    const [page, setPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [altTitle, setAltTitle] = useState("Loading...");
    const [altAuthor, setAltAuthor] = useState("Loading...");
    const { id } = useParams();

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/api/v1/book/${localStorage.getItem("userId")}/${id}/pages`);
                setPage(response.data);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.pageNumber);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.error('Page not found.');
                    setTotalPages(0);
                    setCurrentPage(0);
                } else {
                    toast.error('Failed to fetch page.');
                }
            }
        };

        fetchPages();
    }, [id]);

    const handlePrevPage = async () => {
        try {
            const response = await axios.get(`http://localhost:8086/api/v1/book/${localStorage.getItem("userId")}/${id}/prev`);
            setPage(response.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.pageNumber);
            setAltAuthor("Not found!");
            setAltTitle("Not found!");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('No previous page available.');
            } else {
                toast.error('Failed to fetch previous page.');
            }
        }
    };

    const handleNextPage = async () => {
        try {
            const response = await axios.get(`http://localhost:8086/api/v1/book/${localStorage.getItem("userId")}/${id}/next`);
            setPage(response.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.pageNumber);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('No next page available.');
            } else {
                toast.error('Failed to fetch next page.');
            }
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content">
            <h2 className="book-title">
                <a href={`/book/${id}`}>{page ? page.bookTitle : altTitle}</a>
            </h2>
            <h3 className="author">
                <a href={`/author/${page ? page.authorId : null}`}>{page ? page.authorName : altAuthor}</a>
            </h3>
                <div className="navigation">
                {currentPage > 1 && (
                    <button className="nav-btn" onClick={handlePrevPage}>Previous</button>
                )}
                    <span className="page-info">{`Page ${currentPage} of ${totalPages}`}</span>
                    {totalPages > currentPage && (
                    <button className="nav-btn" onClick={handleNextPage}>Next</button>
                )}
                </div>
                <div className="page-content">
                    <p>{page ? page.content : 'Loading...'}</p>
                </div>
            </div>
            <ToastContainer />
            <footer className="page-footer">
                <p>&copy; 2024 UzbekReads. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Page;
