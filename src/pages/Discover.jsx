import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BookCard from '../components/BookCard'

const Discover = () => {
  const { genre } = useParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // This would be replaced with actual genre list from OpenLibrary
        // For now, we'll use a static list of popular genres
        const popularGenres = [
          'Fiction', 'Science Fiction', 'Mystery', 'Romance', 
          'Fantasy', 'Thriller', 'Biography', 'History',
          'Science', 'Technology', 'Art', 'Philosophy'
        ]
        setGenres(popularGenres)
      } catch (error) {
        console.error('Error fetching genres:', error)
      }
    }
    
    fetchGenres()
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        let url = 'https://openlibrary.org/trending/daily.json?limit=12'
        
        if (genre) {
          url = `https://openlibrary.org/subjects/${genre.toLowerCase().replace(/\s+/g, '_')}.json?limit=12`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        const booksData = (genre ? data.works : data.works)?.map(item => {
          const work = genre ? item : item
          return {
            id: work.key.replace('/works/', ''),
            title: work.title,
            author: work.authors?.[0]?.name || work.author_name?.[0] || 'Unknown Author',
            authorId: work.authors?.[0]?.key?.replace('/authors/', '') || work.author_key?.[0],
            cover: work.cover_id || work.cover_i
              ? `https://covers.openlibrary.org/b/id/${work.cover_id || work.cover_i}-M.jpg` 
              : '/book-placeholder.png',
            published: work.first_publish_year || 'N/A',
            subjects: work.subject?.slice(0, 3) || []
          }
        }) || []
        
        setBooks(booksData)
      } catch (err) {
        setError('Failed to fetch books')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooks()
  }, [genre])

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {genre ? `${genre} Books` : 'Discover Books'}
        </h1>
        <p className="text-gray-600 mt-2">
          {genre 
            ? `Explore popular books in the ${genre} genre` 
            : 'Browse books by genre'}
        </p>
      </div>
      
      {/* Genre Navigation */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          {genre ? 'Other Genres' : 'Browse by Genre'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((g, index) => (
            <Link
              key={index}
              to={`/discover/${g}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                genre === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {g}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default Discover