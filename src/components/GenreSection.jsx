import React, { useState, useEffect } from 'react'
import BookCard from './BookCard'
import { Link } from 'react-router-dom'

const GenreSection = ({ title, genre }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooksByGenre = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://openlibrary.org/subjects/${genre}.json?limit=4`
        )
        const data = await response.json()
        
        if (data.works) {
          const booksData = data.works.map(work => ({
            id: work.key.replace('/works/', ''),
            title: work.title,
            author: work.authors?.[0]?.name || 'Unknown Author',
            authorId: work.authors?.[0]?.key?.replace('/authors/', ''),
            cover: work.cover_id 
              ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` 
              : '/book-placeholder.png',
            published: work.first_publish_year || 'N/A',
            subjects: work.subject?.slice(0, 3) || []
          }))
          setBooks(booksData)
        }
      } catch (error) {
        console.error(`Error fetching ${genre} books:`, error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooksByGenre()
  }, [genre])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <Link 
          to={`/discover/${genre}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default GenreSection