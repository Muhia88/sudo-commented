// src/components/Navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaBookOpen, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa'

const Navbar = ({ user, onSignIn, onSignOut }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  // Fetch search suggestions from OpenLibrary
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
      )
      const data = await response.json()
      
      if (data.docs) {
        setSuggestions(data.docs.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (title) => {
    setSearchQuery(title)
    navigate(`/search?q=${encodeURIComponent(title)}`)
    setSuggestions([])
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white font-bold text-xl py-1 px-3 rounded">
              ShelfScope
            </div>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  fetchSuggestions(e.target.value)
                }}
                placeholder="Search books, authors, or keywords..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FaSearch />
              </button>
            </form>
            
            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {suggestions.map((book, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(book.title)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium truncate">{book.title}</div>
                    <div className="text-sm text-gray-600 truncate">
                      by {book.author_name?.join(', ') || 'Unknown Author'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/discover" className="hidden md:flex items-center text-gray-700 hover:text-blue-600">
              <FaBookOpen className="mr-1" />
              <span>Discover</span>
            </Link>
            
            <Link to="/reading-list" className="hidden md:flex items-center text-gray-700 hover:text-blue-600">
              <FaHeart className="mr-1" />
              <span>Reading List</span>
            </Link>
            
            {/* User Profile */}
            {user ? (
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                      <FaUser />
                    </div>
                  )}
                </div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium truncate">{user.displayName || user.email}</p>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar