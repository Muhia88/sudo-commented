// src/components/Navbar.jsx
// Imports React and the useState hook.
import React, { useState } from 'react';
// Imports Link and useNavigate for routing.
import { Link, useNavigate } from 'react-router-dom';
// Imports icons from the react-icons library.
import { FaHeart, FaCompass, FaHeadphones } from 'react-icons/fa';

// Defines the Navbar component.
const Navbar = ({ user, onSignOut }) => {
  // State for the search input.
  const [searchQuery, setSearchQuery] = useState('');
  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // Function to handle the search form submission.
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigates to the search results page.
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Returns the JSX for the navigation bar.
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* // The brand logo, linking to the home page. */}
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white font-bold text-xl py-1 px-3 rounded">
               ShelfScope Books
            </div>
          </Link>
          
          {/* // The search form. */}
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, or topics..."
                className="w-full pl-4 pr-20 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* // Navigation links. */}
          <div className="flex items-center space-x-6">
            {/* // Link to the "Listen" section. */}
            <Link to="/listen" className="flex items-center text-gray-700 hover:text-purple-600" title="Go to Listen Section">
              <FaHeadphones className="mr-1" />
              <span>Listen</span>
            </Link>
            {/* // Link to the "Discover" page. */}
            <Link to="/discover" className="flex items-center text-gray-700 hover:text-blue-600">
              <FaCompass className="mr-1" />
              <span>Discover</span>
            </Link>
            {/* // Link to the user's reading list. */}
            <Link to="/my-list" className="flex items-center text-gray-700 hover:text-blue-600">
              <FaHeart className="mr-1" />
              <span>My List</span>
            </Link>
            
            {/* // The sign-out button, shown only if a user is logged in. */}
            {user && (
              <div className="relative group">
                 <button onClick={onSignOut} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                   Sign Out
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Exports the Navbar component.
export default Navbar;