// src/pages/ReadingList.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore'; // Firestore functions to get a document.
import { db } from '../firebase/firebase'; // Firebase database instance.
import BookCard from '../components/BookCard'; // Component to display a single book.
import { Link } from 'react-router-dom'; // Component for navigation.

/**
 * ReadingList component displays the user's saved list of books.
 * It fetches the list from Firestore for the currently logged-in user.
 * @param {object} props - The properties passed to the component.
 * @param {object} props.user - The currently authenticated user object.
 * @returns {JSX.Element} - A JSX element representing the user's reading list page.
 */
const ReadingList = ({ user }) => {
  // State to store the user's list of books.
  const [readingList, setReadingList] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch the user's reading list from Firestore.
  useEffect(() => {
    const fetchReadingList = async () => {
      // If there is no user, do not fetch anything.
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get a reference to the user's document in Firestore.
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Get the readingList map from the user's document.
          const list = userDoc.data().readingList || {};
          // Convert the map of books into an array, filter out any invalid entries, and sort by added date.
          const books = Object.entries(list)
            .filter(([id, bookData]) => bookData && bookData.title)
            .map(([id, bookData]) => ({ ...bookData, id }))
            .sort((a, b) => (b.addedAt?.seconds || 0) - (a.addedAt?.seconds || 0));
          setReadingList(books);
        }
      } catch (err) {
        setError('Failed to fetch reading list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, [user]); // Rerun the effect if the user object changes.

  // If there's no user, prompt them to sign in.
  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Your Reading List</h2>
          <p className="text-gray-600 mb-6">
            Save books to your personal reading list and track your progress across devices.
          </p>
        </div>
      </div>
    );
  }

  // Render a loading spinner while data is being fetched.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render an error message if the fetch fails.
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Reading List</h1>
      </div>

      {readingList.length === 0 ? (
        // If the reading list is empty, show a message and a link to discover more books.
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Your reading list is empty</h3>
          <p className="text-gray-600 mb-4">
            Start adding books to your reading list to see them here.
          </p>
          <Link
            to="/discover"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition duration-200"
          >
            Discover Books
          </Link>
        </div>
      ) : (
        // If the reading list is not empty, display the books in a grid.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingList.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showProgress={true} // This prop is not used in the BookCard component.
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingList;