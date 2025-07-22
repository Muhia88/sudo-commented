// src/pages/BookDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import ProgressBar from '../components/ProgressBar'
import AudioPlayer from '../components/AudioPlayer'

const BookDetail = ({ user }) => {
  const { workId } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInReadingList, setIsInReadingList] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)

  // Fetch book details from OpenLibrary
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://openlibrary.org/works/${workId}.json`)
        const data = await response.json()
        
        // Fetch author details
        let authorName = 'Unknown Author'
        if (data.authors && data.authors.length > 0) {
          const authorId = data.authors[0].author.key.replace('/authors/', '')
          const authorResponse = await fetch(`https://openlibrary.org/authors/${authorId}.json`)
          const authorData = await authorResponse.json()
          authorName = authorData.name
        }
        
        // Get cover image
        let coverUrl = '/book-placeholder.png'
        if (data.covers && data.covers.length > 0) {
          coverUrl = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        }
        
        // Extract subjects/genres
        const subjects = data.subjects || []
        
        setBook({
          id: workId,
          title: data.title,
          author: authorName,
          authorId: data.authors?.[0]?.author?.key?.replace('/authors/', ''),
          cover: coverUrl,
          description: data.description?.value || data.description || 'No description available.',
          published: data.first_publish_date || 'N/A',
          pages: data.number_of_pages || 0,
          subjects: subjects.slice(0, 5),
          readUrl: `https://openlibrary.org/works/${workId}/Page?view=iframe`,
          audioUrl: data.ia_loaded_id ? `https://archive.org/download/${data.ia_loaded_id}` : null
        })
        
        setTotalPages(data.number_of_pages || 0)
      } catch (err) {
        setError('Failed to fetch book details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookDetails()
  }, [workId])

  // Check if book is in user's reading list
  useEffect(() => {
    const checkReadingList = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const readingList = userDoc.data().readingList || {}
          setIsInReadingList(readingList[workId] !== undefined)
          
          // Load reading progress if exists
          if (readingList[workId]) {
            setReadingProgress(readingList[workId].progress || 0)
            setCurrentPage(readingList[workId].currentPage || 1)
          }
        }
      }
    }
    
    if (user) {
      checkReadingList()
    }
  }, [user, workId])

  // Add book to reading list
  const addToReadingList = async () => {
    if (!user) return
    
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        [`readingList.${workId}`]: {
          addedAt: new Date(),
          progress: readingProgress,
          currentPage: currentPage,
          genre: book.subjects[0] || 'General'
        }
      })
      setIsInReadingList(true)
    } catch (error) {
      console.error('Error adding to reading list:', error)
    }
  }

  // Update reading progress
  const updateProgress = async (progress, page) => {
    setReadingProgress(progress)
    setCurrentPage(page)
    
    if (user && isInReadingList) {
      try {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          [`readingList.${workId}.progress`]: progress,
          [`readingList.${workId}.currentPage`]: page
        })
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Book Cover */}
        <div className="md:w-1/3">
          <img 
            src={book.cover} 
            alt={book.title} 
            className="rounded-lg shadow-lg w-full max-w-xs mx-auto"
          />
          
          {book.audioUrl && (
            <button
              onClick={() => setShowPlayer(!showPlayer)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <span className="mr-2">{showPlayer ? 'Hide Audiobook' : 'Listen to Audiobook'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {showPlayer && book.audioUrl && (
            <div className="mt-4">
              <AudioPlayer audioUrl={`${book.audioUrl}/format:mp3`} />
            </div>
          )}
        </div>
        
        {/* Book Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-700 mb-4">
            by <a 
              href={`/author/${book.authorId}`} 
              className="text-blue-600 hover:underline"
            >
              {book.author}
            </a>
          </p>
          
          <div className="flex items-center mb-6">
            <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
              Published: {book.published}
            </span>
            <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
              Pages: {book.pages || 'N/A'}
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Genres:</h3>
            <div className="flex flex-wrap gap-2">
              {book.subjects.map((subject, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={addToReadingList}
              disabled={isInReadingList}
              className={`${
                isInReadingList 
                  ? 'bg-green-600 cursor-default' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-2 px-6 rounded-lg transition duration-200 flex items-center`}
            >
              {isInReadingList ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In Your Reading List
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Reading List
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Reading Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reading Progress</h2>
        <ProgressBar 
          progress={readingProgress} 
          onProgressChange={updateProgress}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
      
      {/* Embedded Reader */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Read This Book</h2>
        <div className="border rounded-lg overflow-hidden h-[600px]">
          <iframe
            src={book.readUrl}
            title={`${book.title} Reader`}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default BookDetail