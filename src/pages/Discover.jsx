// src/pages/Discover.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // To get URL parameters and create links.
import BookCard from '../components/BookCard'; // Component to display a single book.
import BookCardSkeleton from '../components/BookCardSkeleton'; // Loading state placeholder.

// A predefined list of popular genres/tags with emojis.
const popularTags = [
  { name: 'Science Fiction', emoji: '🚀' },
  { name: 'Fantasy', emoji: '🧙' },
  { name: 'Detective', emoji: '🕵️' },
  { name: 'Gothic Fiction', emoji: '🏰' },
  { name: 'Sea Stories', emoji: '⛵' },
  { name: 'Mythology', emoji: '✨' },
  { name: 'Poetry', emoji: '✒️' },
  { name: 'Philosophy', emoji: '🤔' },
  { name: "Children's Literature", emoji: '🧸' },
  { name: 'Adventure', emoji: '🗺️' },
];

/**
 * Discover component allows users to discover books by Browse popular genres.
 * It fetches and displays books for a selected genre.
 * @returns {JSX.Element} - A JSX element representing the discover page.
 */
const Discover = () => {
  // Get the genre from the URL parameters.
  const { genre } = useParams();
  // State to store the fetched books.
  const [books, setBooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch books when the genre parameter changes.
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // If a genre is selected, use it as the topic; otherwise, default to 'popular'.
        const topic = genre || 'popular';
        // Construct the Gutendex API URL.
        const url = `https://gutendex.com/books?topic=${topic.toLowerCase().replace(/\s+/g, '_')}`;

        const response = await fetch(url);
        const data = await response.json();

        // Set the fetched books to the state, or an empty array if no results.
        setBooks(data.results || []);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre]); // Rerun the effect whenever the genre changes.

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {genre ? `Discover ${genre}` : 'Discover Books'}
        </h1>
        <p className="text-gray-600 mt-2">
          {genre
            ? `Explore popular books in the ${genre} genre`
            : 'Browse books by genre'}
        </p>
      </div>

      {/* Section for popular genre tags */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/discover/${tag.name}`}
              // Dynamically style the link based on whether it's the currently active genre.
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                genre === tag.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name} {tag.emoji}
            </Link>
          ))}
        </div>
      </div>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Grid to display the books. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Display skeleton loaders while fetching data.
          Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
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

export default Discover;