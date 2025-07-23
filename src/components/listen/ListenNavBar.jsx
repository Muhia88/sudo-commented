// src/components/listen/ListenNavbar.jsx
// Imports the React library and the useState hook for managing component state.
import React, { useState } from 'react';
// Imports the Link component for navigation and the useNavigate hook for programmatic navigation from react-router-dom.
import { Link, useNavigate } from 'react-router-dom';
// Imports specific icons from the react-icons library.
import { FaHeadphones, FaHeart, FaCompass, FaBook } from 'react-icons/fa';
// Defines the ListenNavbar functional component, which receives user and onSignOut props.
const ListenNavbar = ({ user, onSignOut }) => {
  // Initializes a state variable 'searchQuery' to store the user's input in the search bar.
  const [searchQuery, setSearchQuery] = useState('');
  // Initializes the navigate function from the useNavigate hook.
  const navigate = useNavigate();
  // Defines the function to handle the search form submission.
  const handleSearch = (e) => {
    // Prevents the default form submission behavior (which would cause a page reload).
    e.preventDefault();
    // Checks if the search query is not empty after trimming whitespace.
    if (searchQuery.trim()) {
      // Navigates to the audiobook search results page with the query as a URL parameter.
      navigate(`/listen/search?q=${encodeURIComponent(searchQuery)}`);
      // Clears the search input field after submission.
      setSearchQuery('');
    }
  };
  // Returns the JSX to be rendered for the component.
  return (
    // The main navigation bar element with styling classes.
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* // A container to center the content and apply padding. */}
      <div className="container mx-auto px-4">
        {/* // A flex container to align items within the navbar. */}
        <div className="flex justify-between items-center h-16">
          {/* // A link to the listen home page, serving as the brand logo. */}
          <Link to="/listen" className="flex items-center">
            {/* // The styled brand name. */}
            <div className="bg-purple-600 text-white font-bold text-xl py-1 px-3 rounded">
               ShelfScope Audio
            </div>
          </Link>
          {/* // A container for the search form, taking up flexible space. */}
          <div className="flex-1 max-w-xl mx-4">
            {/* // The search form element. */}
            <form onSubmit={handleSearch} className="relative">
              {/* // The search input field. */}
              <input
                type="text"
                // Binds the input's value to the searchQuery state.
                value={searchQuery}
                // Updates the searchQuery state whenever the user types.
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audiobooks by title..."
                className="w-full pl-4 pr-20 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {/* // The search submit button. */}
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700"
              >
                Search
              </button>
            </form>
          </div>
          {/* // A container for the navigation links. */}
          <div className="flex items-center space-x-6">
            // A link to switch to the "Read" section.
            <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600" title="Go to Read Section">
              <FaBook className="mr-1" />
              <span>Read</span>
            </Link>
            {/* // A link to the discover audiobooks page. */}
            <Link to="/discover-audiobooks" className="flex items-center text-gray-700 hover:text-purple-600">
              <FaCompass className="mr-1" />
              <span>Discover</span>
            </Link>
            {/* // A link to the user's saved audiobooks list. */}
            <Link to="/my-listens" className="flex items-center text-gray-700 hover:text-purple-600">
              <FaHeart className="mr-1" />
              <span>My Listens</span>
            </Link>
            {/* // A button to sign out, which is only rendered if a user is logged in. */}
            {user && (
              <button onClick={onSignOut} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
// Exports the ListenNavbar component as the default export of this module.
export default ListenNavbar;