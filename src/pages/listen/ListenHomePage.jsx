// src/pages/listen/ListenHomePage.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import AudioBookCard from '../../components/AudioBookCard'; // Component to display a single audiobook.
import AudioBookCardSkeleton from '../../components/AudioBookCardSkeleton'; // Loading state placeholder.

/**
 * ListenHomePage component serves as the main page for the "Listen" section.
 * It fetches and displays a list of recently added audiobooks.
 * @returns {JSX.Element} - A JSX element representing the listen home page.
 */
const ListenHomePage = () => {
  // State to store the fetched recent audiobooks.
  const [recentAudioBooks, setRecentAudioBooks] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch recent audiobooks when the component mounts.
  useEffect(() => {
    const fetchRecentAudioBooks = async () => {
      try {
        setLoading(true);
        // Construct the LibriVox API URL to get the 10 most recently cataloged audiobooks.
        const targetUrl = 'https://librivox.org/api/feed/audiobooks/?sort_order=catalog_date_desc&limit=10&format=json';
        // Use a proxy to avoid CORS issues.
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        const data = await response.json();
        // Set the fetched books to the state, or an empty array if no books are found.
        setRecentAudioBooks(data.books || []);
      } catch (err) {
        setError('Failed to fetch recent audiobooks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAudioBooks();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div>
      {/* Page header */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold mb-4">Listen to Timeless Classics</h1>
        <p className="text-lg text-gray-600">
          Explore thousands of free audiobooks.
        </p>
      </div>

      {/* Section title for recently added audiobooks */}
      <h2 className="text-2xl font-bold mb-4">Recently Added Audiobooks</h2>

      {/* Display an error message if the fetch fails. */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Grid to display the audiobooks. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          // Display skeleton loaders while fetching data.
          Array.from({ length: 10 }).map((_, index) => (
            <AudioBookCardSkeleton key={index} />
          ))
        ) : (
          // Map through the recent audiobooks and render an AudioBookCard for each.
          recentAudioBooks.map(book => (
            <AudioBookCard key={book.id} audiobook={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default ListenHomePage;