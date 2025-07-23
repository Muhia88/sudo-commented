// src/pages/AuthorPage.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get URL parameters.
import BookCard from '../components/BookCard'; // Component to display a single book.
import BookCardSkeleton from '../components/BookCardSkeleton'; // Loading state placeholder.

/**
 * AuthorPage component fetches and displays a list of books by a specific author.
 * The author's name is retrieved from the URL parameters.
 * @returns {JSX.Element} - A JSX element representing the author's page.
 */
const AuthorPage = () => {
  // Get the author's name from the URL.
  const { authorName } = useParams();
  // State to store the fetched books.
  const [books, setBooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch the author's books when the authorName parameter changes.
  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        setLoading(true);
        // Fetch books from the Gutendex API, searching by the author's name.
        const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(authorName)}`);
        const data = await response.json();
        // Set the fetched books to the state.
        setBooks(data.results);
      } catch (err) {
        setError("Failed to fetch author's books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorBooks();
  }, [authorName]); // Rerun the effect whenever the authorName changes.

  return (
    <div>
      {/* Page title, decoding the author's name for display. */}
      <h1 className="text-4xl font-bold mb-6">Books by {decodeURIComponent(authorName)}</h1>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {/* Grid to display the books. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          // Display skeleton loaders while fetching data.
          Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : books.length === 0 ? (
          // Display a message if no books are found for the author.
          <p className="col-span-full text-center">No books found for this author.</p>
        ) : (
          // Map through the books and render a BookCard for each.
          books.map(book => (
            <BookCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorPage;