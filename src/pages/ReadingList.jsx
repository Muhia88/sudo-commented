// src/pages/ReadingList.jsx
import React, { useState, useEffect } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import BookCard from '../components/BookCard'

const ReadingList = ({ user }) => {
  const [readingList, setReadingList] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeGenre, setActiveGenre] = useState('all')
  const [genres, setGenres] = useState([])

  // Fetch user's reading list from Firestore
  useEffect(() => {
    const fetchReadingList = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const list = userDoc.data().readingList || {}
          setReadingList(list)
          
          // Extract unique genres
          const genreSet = new Set()
          Object.values(list).forEach(book => {
            if (book.genre) {
              genreSet.add(book.genre)
            }
          })
          setGenres(['all', ...Array.from(genreSet)])
        }
      } catch (err) {
        setError('Failed to fetch reading list')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReadingList()
  }, [user])

  // Filter books by genre
  const filteredBooks = Object.entries(readingList)
    .filter(([id, book]) => activeGenre === 'all' || book.genre === activeGenre)
    .sort((a, b) => b[1].addedAt - a[1].addedAt)

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to View Your Reading List</h2>
          <p className="text-gray-600 mb-6">
            Save books to your personal reading list and track your progress across devices.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition duration-200">
            Sign In with Google
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Reading List</h1>
      </div>
      
      {/* Genre Filters */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                activeGenre === genre
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {genre === 'all' ? 'All Books' : genre}
            </button>
          ))}
        </div>
      </div>
      
      {/* Reading List Books */}
      {filteredBooks.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Your reading list is empty</h3>
          <p className="text-gray-600 mb-4">
            Start adding books to your reading list to see them here.
          </p>
          <a 
            href="/discover" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition duration-200"
          >
            Discover Books
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(([id, bookData]) => (
            <BookCard 
              key={id} 
              book={{...bookData, id}} 
              showProgress={true} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReadingList