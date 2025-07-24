// src/components/AudioBookCard.jsx
// Imports React and the useState and useEffect hooks.
import React, { useState, useEffect } from 'react';
// Imports the Link component for navigation.
import { Link } from 'react-router-dom';
// Imports the skeleton component to show while loading.
import AudioBookCardSkeleton from './AudioBookCardSkeleton';
// Defines the AudioBookCard component, which receives an 'audiobook' object as a prop.
const AudioBookCard = ({ audiobook }) => {
  // State to store the URL of the book cover.
  const [coverUrl, setCoverUrl] = useState(null);
  // State to manage the loading status of the cover image fetch.
  const [loading, setLoading] = useState(true);
  // The useEffect hook to fetch the cover image when the component mounts or the audiobook title changes.
  useEffect(() => {
    // Defines an asynchronous function to fetch the cover.
    const fetchCover = async () => {
      // Sets loading to true before the fetch.
      setLoading(true);
      // Checks if the audiobook has a title.
      if (audiobook.title) {
        try {
          // Constructs the target URL for the Open Library search API.
          const targetUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(audiobook.title)}`;
          // Constructs the URL for the proxy Cloud Function.
          const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getOpenLibraryData?url=${encodeURIComponent(targetUrl)}`;
          // Fetches data from the proxy.
          const response = await fetch(proxyUrl);
          // Parses the JSON response.
          const data = await response.json();
          // Checks if a cover ID exists in the response and constructs the cover URL.
          if (data.docs && data.docs[0] && data.docs[0].cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`);
          } else {
            // Sets a fallback placeholder image if no cover is found.
            setCoverUrl('/image-placeholder.jpg');
          }
        } catch (error) {
          // Logs any errors and sets the fallback image.
          console.error("Failed to fetch book cover", error);
          setCoverUrl('/image-placeholder.jpg');
        }
      } else {
         // Sets the fallback image if there's no title to search for.
         setCoverUrl('/image-placeholder.jpg');
      }
      // Sets loading to false once the fetch is complete.
      setLoading(false);
    };
    // Calls the fetch function.
    fetchCover();
    // The dependency array ensures this effect re-runs if the audiobook title changes.
  }, [audiobook.title]);
  // If the cover is loading, render the skeleton component.
  if (loading) {
    return <AudioBookCardSkeleton />;
  }
  // Formats the author's name, providing a default if it's missing.
  const author = audiobook.authors?.[0]?.last_name ? `${audiobook.authors[0].first_name} ${audiobook.authors[0].last_name}` : 'Unknown Author';
  // Returns the JSX for the audiobook card.
  return (
    // The main container for the card with styling and hover effects.
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      {/* // A link wrapping the image, navigating to the audiobook's detail page. */}
      <Link to={`/audiobook/${audiobook.id}`}>
        {/* // The cover image. */}
        <img 
          src={coverUrl} 
          alt={audiobook.title} 
          className="w-full h-64 object-cover bg-gray-200"
        />
      </Link>
      {/* // A container for the card's text content. */}
      <div className="p-4">
        {/* // The title of the audiobook. */}
        <h3 className="font-bold text-lg truncate" title={audiobook.title}>{audiobook.title}</h3>
        {/* // The author of the audiobook. */}
        <p className="text-gray-600 text-sm">
          by {author}
        </p>
      </div>
    </div>
  );
};
// Exports the AudioBookCard component.
export default AudioBookCard;