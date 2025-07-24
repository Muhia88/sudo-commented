import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import BookCardSkeleton from '../components/BookCardSkeleton';

// A predefined list of popular genres/tags with emojis.
const popularTags = [
  { name: 'Fantasy', emoji: '🧙' },
  { name: 'Detective', emoji: '🕵️' },
  { name: 'Mythology', emoji: '✨' },
  { name: 'Poetry', emoji: '✒️' },
  { name: 'Philosophy', emoji: '🤔' },
  { name: 'Adventure', emoji: '🗺️' },
];


//allows users to discover books by Browse popular genres. 
const Discover = () => {
  
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Effect to fetch books when the genre parameter changes.
  useEffect(() => {
    const fetchBooks = async () => {
      // If no genre is selected from the URL, do not fetch anything.
      if (!genre) {
        setBooks([]); 
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const topic = genre;
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
          // Display skeleton loaders ONLY when fetching data for a selected genre.
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

      {/* Show a prompt to the user if no genre is selected and nothing is loading */}
      {!loading && !genre && (
        <div className="col-span-full text-center text-gray-600 mt-8">
            <p>Please select a genre to start discovering books.</p>
        </div>
      )}
    </div>
  );
};

export default Discover;