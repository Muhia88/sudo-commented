// src/pages/listen/AudioBookDetail.jsx

// Import necessary React hooks and components.
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // To get URL parameters.
import { doc, getDoc, updateDoc, deleteField, setDoc } from 'firebase/firestore'; // Firestore operations.
import { db } from '../../firebase/firebase'; // Firebase database instance.
import AudioPlayer from '../../components/AudioPlayer'; // Custom audio player component.

/**
 * AudioBookDetail component displays the details of a single audiobook,
 * including its cover, description, chapters, and an audio player.
 * It also allows users to add the audiobook to their "listens" and save their progress.
 * @param {object} props - The properties passed to the component.
 * @param {object} props.user - The currently authenticated user object.
 * @returns {JSX.Element} - A JSX element representing the audiobook detail page.
 */
const AudioBookDetail = ({ user }) => {
  // Get the audiobook ID from the URL.
  const { audioBookId } = useParams();
  // State for the audiobook data.
  const [audiobook, setAudiobook] = useState(null);
  // State for the book cover URL.
  const [coverUrl, setCoverUrl] = useState('/image-placeholder.jpg');
  // State for loading status.
  const [loading, setLoading] = useState(true);
  // State for error messages.
  const [error, setError] = useState(null);
  // State to check if the audiobook is in the user's list.
  const [isInList, setIsInList] = useState(false);

  // State for the audio player.
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Index of the current chapter/track.
  const [savedTime, setSavedTime] = useState(0); // Saved playback time.

  // Ref to access the AudioPlayer component's methods.
  const playerRef = useRef(null);

  // Effect to fetch the audiobook details and user's listening status.
  useEffect(() => {
    const fetchAudioBook = async () => {
      try {
        setLoading(true);
        // Construct the LibriVox API URL.
        const targetUrl = `https://librivox.org/api/feed/audiobooks/?id=${audioBookId}&format=json&extended=1`;
        // Use a proxy to avoid CORS issues.
        const proxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getLibrivoxData?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Failed to fetch audiobook from server.');

        const data = await response.json();
        const bookData = data.books?.[0];

        if (bookData) {
          setAudiobook(bookData);
          // Fetch the book cover from Open Library.
          const coverTargetUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(bookData.title)}`;
          const coverProxyUrl = `https://us-central1-test-proj-1-825b7.cloudfunctions.net/getOpenLibraryData?url=${encodeURIComponent(coverTargetUrl)}`;
          const coverResponse = await fetch(coverProxyUrl);
          const coverData = await coverResponse.json();
          if (coverData.docs && coverData.docs[0] && coverData.docs[0].cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${coverData.docs[0].cover_i}-L.jpg`);
          }
        } else {
          throw new Error('Audiobook not found.');
        }

        // If a user is logged in, fetch their listening data for this book.
        if (user && bookData) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const listenList = userDoc.data().listenList || {};
            setIsInList(!!listenList[audioBookId]);
            if (listenList[audioBookId]) {
              setCurrentTrackIndex(listenList[audioBookId].currentTrackIndex || 0);
              setSavedTime(listenList[audioBookId].currentTime || 0);
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch audiobook details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudioBook();
  }, [audioBookId, user]); // Rerun effect if the audiobook ID or user changes.

  /**
   * Toggles the audiobook's presence in the user's "listen list" in Firestore.
   */
  const toggleListenList = async () => {
    if (!user || !audiobook) return;
    const userRef = doc(db, 'users', user.uid);

    if (isInList) {
      // If the book is in the list, remove it.
      await updateDoc(userRef, {
        [`listenList.${audioBookId}`]: deleteField()
      });
    } else {
      // If the book is not in the list, add it.
      const audioBookData = {
        id: audiobook.id,
        title: audiobook.title,
        authors: audiobook.authors,
        currentTrackIndex: 0,
        currentTime: 0,
      };
      await setDoc(userRef, { listenList: { [audioBookId]: audioBookData } }, { merge: true });
    }
    setIsInList(!isInList); // Update the local state.
  };

  /**
   * Saves the user's listening progress to Firestore.
   * @param {number} currentTime - The current playback time to save.
   */
  const saveProgress = async (currentTime) => {
    if (user && isInList) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`listenList.${audioBookId}.currentTrackIndex`]: currentTrackIndex,
        [`listenList.${audioBookId}.currentTime`]: currentTime,
      });
      alert('Progress saved!');
    } else {
      alert('Add the audiobook to your list to save progress.');
    }
  };

  // Render loading, error, or not found states.
  if (loading) return <div className="text-center py-10">Loading audiobook...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!audiobook) return <div className="text-center py-10">Audiobook not found.</div>;

  // Format author name.
  const author = audiobook.authors?.[0]?.last_name ? `${audiobook.authors[0].first_name} ${audiobook.authors[0].last_name}` : 'Various';
  // Get the current track based on the index.
  const currentTrack = audiobook.sections?.[currentTrackIndex];

  return (
    <div>
      {/* Audiobook header with cover, title, author, description, and action buttons. */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/4">
          <img src={coverUrl} alt={audiobook.title} className="w-full rounded-lg shadow-lg bg-gray-200" />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-4xl font-bold">{audiobook.title}</h1>
          <p className="text-xl text-gray-700">by {author}</p>
          <p className="mt-4 text-gray-600" dangerouslySetInnerHTML={{ __html: audiobook.description }} />

          <div className="mt-6 flex space-x-4">
            <button onClick={toggleListenList} className={`px-6 py-2 rounded-full font-semibold ${isInList ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'}`}>
              {isInList ? 'Remove from My Listens' : 'Add to My Listens'}
            </button>
            <button onClick={() => playerRef.current?.saveCurrentTime()} className="px-6 py-2 rounded-full bg-yellow-500 text-white">
              Save Progress
            </button>
          </div>
        </div>
      </div>

      {/* Main content with audio player and chapter list. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Player</h2>
            {currentTrack ? (
                <div>
                    <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                    <AudioPlayer
                      ref={playerRef}
                      audioUrl={currentTrack.listen_url}
                      startTime={savedTime}
                      onSave={saveProgress}
                    />
                </div>
            ) : (
                <p>No tracks available for this audiobook.</p>
            )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Chapters</h2>
            <ul className="h-96 overflow-y-auto">
                {audiobook.sections && audiobook.sections.map((track, index) => (
                    <li key={track.id}
                        onClick={() => {
                          setCurrentTrackIndex(index);
                          setSavedTime(0); // Reset time when changing chapters.
                        }}
                        className={`p-3 rounded cursor-pointer ${currentTrackIndex === index ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                    >
                        {track.title}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioBookDetail;