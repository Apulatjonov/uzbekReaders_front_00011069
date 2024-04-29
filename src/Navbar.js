import React, { useState } from 'react';
import './css/navbar.css'; // Import CSS file for styling

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);


  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowBusinessMenu(!showBusinessMenu); // Toggle the visibility of the business menu

  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };

  const handleProfile = () => {
    window.location.href = '/profile';
  };

  const handleMyLibrary = () => {
    window.location.href = '/myLibrary';
  };

  const toLogin = () => {
    window.location.href = '/login';
  }

  const handleMyBooks = () => {
    window.location.href = '/myBooks';
  }

  const handleStats = () => {
    window.location.href = '/user/statistics';
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">UzbekReads</a>
      </div>
      <div className="actions">
        {localStorage.getItem('userId') ? (
          <div className="menu">
            <button className="sign-in-button" onClick={handleDropdownToggle}>
              Business
            </button>
            {showBusinessMenu && ( // Conditionally render the business menu items
              <>
                <button className="sign-in-button" onClick={handleMyBooks}>
                  My books
                </button>
                <button className="sign-in-button" onClick={handleStats}>
                  Statistics
                </button>
              </>
            )}
            <button className="sign-in-button" onClick={handleProfile}>
              Profile
            </button>
            <button className="sign-in-button" onClick={handleMyLibrary}>
              My library
            </button>
            <button className="sign-in-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="sign-in-button" onClick={toLogin}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;