// src/pages/Home.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Although Link is imported, it is not used in this component.
import BookCard from '../components/BookCard'; // Component to display a single book.
import BookCardSkeleton from '../components/BookCardSkeleton'; // Loading state placeholder.

/**
 * Home component serves as the main landing page for the "Read" section.
 * It fetches and displays a list of popular books.
 * @returns {JSX.Element} - A JSX element representing the home page.
 */
const Home = () => {
  // State to store the fetched popular books.
  const [popularBooks, setPopularBooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch popular books when the component mounts.
  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        setLoading(true);
        // Fetch popular books from the Gutendex API.
        const response = await fetch('https://gutendex.com/books/?sort=popular');
        const data = await response.json();
        // Set the fetched books to the state.
        setPopularBooks(data.results);
      } catch (err) {
        setError('Failed to fetch popular books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div>
      {/* Page header */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Book</h1>
        <p className="text-lg text-gray-600">
          Explore thousands of free books.
        </p>
      </div>

      {/* Section title for popular books */}
      <h2 className="text-2xl font-bold mb-4">Popular Books</h2>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Grid to display the books. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          // Display skeleton loaders while fetching data.
          Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : (
          // Map through the popular books and render a BookCard for each.
          popularBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;