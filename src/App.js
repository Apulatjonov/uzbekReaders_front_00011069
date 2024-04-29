import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Login from './Login';
import Home from './Home';
import Book from './Book';
import Profile from './Profile';
import MyLibrary from './MyLibrary';
import CategoryPage from './CategoryPage';
import Page from './Page';
import MyBooks from './MyBooks';
import Author from './Author';
import Statistics from './Statistics';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Use Routes component here */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myLibrary" element={<MyLibrary />} />
          <Route path="/myBooks" element={<MyBooks />} />
          <Route path="/category/:id/:name" element={<CategoryPage/>} />
          <Route path="/author/:id/:name" element={<Author/>} />
          <Route path="/book/:id/page" element={<Page/>}/>
          <Route path="/user/statistics" element={<Statistics/>}/>
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
