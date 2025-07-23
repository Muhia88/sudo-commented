// src/pages/listen/MyListens.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore'; // Firestore functions to get a document.
import { db } from '../../firebase/firebase'; // Firebase database instance.
import AudioBookCard from '../../components/AudioBookCard'; // Component to display a single audiobook.
import { Link } from 'react-router-dom'; // Component for navigation.

/**
 * MyListens component displays the user's saved list of audiobooks.
 * It fetches the list from Firestore for the currently logged-in user.
 * @param {object} props - The properties passed to the component.
 * @param {object} props.user - The currently authenticated user object.
 * @returns {JSX.Element} - A JSX element representing the user's "My Listens" page.
 */
const MyListens = ({ user }) => {
  // State to store the user's list of audiobooks.
  const [listenList, setListenList] = useState([]);
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during the fetch.
  const [error, setError] = useState(null);

  // Effect to fetch the user's listen list from Firestore.
  useEffect(() => {
    const fetchListenList = async () => {
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
          // Get the listenList map from the user's document.
          const list = userDoc.data().listenList || {};
          // Convert the map of audiobooks into an array.
          const audiobooks = Object.values(list);
          setListenList(audiobooks);
        }
      } catch (err) {
        setError('Failed to fetch your listens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListenList();
  }, [user]); // Rerun the effect if the user object changes.

  // Render a loading spinner while data is being fetched.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Render an error message if the fetch fails.
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Listens</h1>
      {listenList.length === 0 ? (
        // If the listen list is empty, show a message and a link to discover more audiobooks.
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Your listen list is empty</h3>
          <p className="text-gray-600 mb-4">
            Start adding audiobooks to see them here.
          </p>
          <Link
            to="/discover-audiobooks"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition duration-200"
          >
            Discover Audiobooks
          </Link>
        </div>
      ) : (
        // If the listen list is not empty, display the audiobooks in a grid.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listenList.map(audiobook => (
            <AudioBookCard key={audiobook.id} audiobook={audiobook} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListens;