// src/pages/listen/AudioBookSearchResults.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // To access the current URL's query parameters.
import AudioBookCard from '../../components/AudioBookCard'; // Component to display a single audiobook.
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton'; // Loading state placeholder.

/**
 * AudioBookSearchResults component fetches and displays a list of audiobooks
 * based on a search query from the URL.
 * @returns {JSX.Element} - A JSX element representing the search results page.
 */
const AudioBookSearchResults = () => {
  // Get the current location object.
  const location = useLocation();
  // Parse the query parameters from the URL.
  const queryParams = new URLSearchParams(location.search);
  // Get the search query 'q' from the query parameters.
  const searchQuery = queryParams.get('q') || '';

  // State to store the fetched audiobooks.
  const [audiobooks, setAudiobooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch search results when the search query changes.
  useEffect(() => {
    const fetchSearchResults = async () => {
      // If there's no search query, do nothing.
      if (!searchQuery) {
        setAudiobooks([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Construct the LibriVox API URL for searching by title.
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?title=${encodeURIComponent(searchQuery)}&format=json`;
        // Use a proxy to avoid CORS issues.
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        const data = await response.json();
        // Set the fetched books to the state, or an empty array if no books are found.
        setAudiobooks(data.books || []);

      } catch (err) {
        setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]); // Rerun the effect whenever the searchQuery changes.

  return (
    <div>
      {/* Display the search query in the page title. */}
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-purple-600">"{searchQuery}"</span>
      </h1>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Grid to display the search results. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          // Display skeleton loaders while fetching data.
          Array.from({ length: 10 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : audiobooks.length === 0 ? (
          // Display a message if no audiobooks are found.
          <p className="col-span-full text-center text-gray-600">No audiobooks found for your search.</p>
        ) : (
          // Map through the audiobooks and render an AudioBookCard for each.
          audiobooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default AudioBookSearchResults;