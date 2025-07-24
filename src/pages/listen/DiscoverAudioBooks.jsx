import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AudioBookCard from '../../components/AudioBookCard';
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton';

// A predefined list of popular genres to display as quick links.
const popularTags = ['Poetry', "Children's Fiction", 'Historical Fiction', 'General Fiction', 'Science fiction'];


//allows users to discover audiobooks by Browse popular genres.
const DiscoverAudioBooks = () => {

  const { genre } = useParams();
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Effect to fetch audiobooks when the genre parameter changes.
  useEffect(() => {
    const fetchBooks = async () => {
      // If no genre is selected, do nothing.
      if (!genre) {
        setAudiobooks([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Construct the LibriVox API URL for the selected genre.
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?format=json&genre=${encodeURIComponent(genre)}`;
        // Use a proxy to avoid CORS issues.
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        if(!response.ok) throw new Error(`Error fetching data for genre: ${genre}`);

        const data = await response.json();
        // Set the fetched books to the state, or an empty array if no books are found.
        setAudiobooks(data.books || []);

      } catch (err) {
        setError('Failed to fetch audiobooks. Please try another genre.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {genre ? `Discover: ${genre}` : 'Discover Audiobooks'}
        </h1>
        <p className="text-gray-600 mt-2">
          Browse audiobooks by genre.
        </p>
      </div>

      {/* Section for popular genre tags */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Popular Genres
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              to={`/discover-audiobooks/${tag}`}
              // Dynamically style the link based on whether it's the currently active genre.
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                genre === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Grid to display the audiobooks. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Display skeleton loaders if a genre is selected and data is loading.
          genre && Array.from({ length: 8 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : (
          // Map through the audiobooks and render an AudioBookCard for each.
          audiobooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
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

export default DiscoverAudioBooks;