// src/pages/SearchResults.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // To access the current URL's query parameters.
import BookCard from '../components/BookCard'; // Component to display a single book.

/**
 * SearchResults component fetches and displays a list of books based on a search query
 * and search type from the URL.
 * @returns {JSX.Element} - A JSX element representing the search results page.
 */
const SearchResults = () => {
  // Get the current location object.
  const location = useLocation();
  // Parse the query parameters from the URL.
  const queryParams = new URLSearchParams(location.search);
  // Get the search query 'q' and 'type' from the query parameters.
  const searchQuery = queryParams.get('q') || '';
  const searchType = queryParams.get('type') || 'search'; // 'search' or 'topic'

  // State to store the fetched books.
  const [books, setBooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch search results when the search query or type changes.
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        // Construct the Gutendex API URL based on the search type and query.
        let url = `https://gutendex.com/books?${searchType}=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Set the fetched books to the state.
        setBooks(data.results);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, searchType]); // Rerun the effect whenever the searchQuery or searchType changes.

  // Render loading and error states.
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      {/* Display the search query in the page title. */}
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-blue-600">"{searchQuery}"</span>
      </h1>

      {books.length === 0 ? (
        // Display a message if no books are found.
        <p>No books found for your search.</p>
      ) : (
        // Grid to display the search results.
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;