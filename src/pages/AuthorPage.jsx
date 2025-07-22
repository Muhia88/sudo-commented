import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BookCard from '../components/BookCard'

const AuthorPage = () => {
  const { authorId } = useParams()
  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch author info
        const authorResponse = await fetch(
          `https://openlibrary.org/authors/${authorId}.json`
        )
        const authorData = await authorResponse.json()
        
        // Fetch author's works
        const worksResponse = await fetch(
          `https://openlibrary.org/authors/${authorId}/works.json?limit=10`
        )
        const worksData = await worksResponse.json()
        
        setAuthor({
          id: authorId,
          name: authorData.name,
          bio: authorData.bio?.value || authorData.bio || 'No biography available.',
          birthDate: authorData.birth_date || 'Unknown',
          deathDate: authorData.death_date || '',
          photo: authorData.photos?.[0] 
            ? `https://covers.openlibrary.org/a/olid/${authorId}-M.jpg`
            : '/author-placeholder.png'
        })
        
        if (worksData.entries) {
          const booksData = worksData.entries.map(work => ({
            id: work.key.replace('/works/', ''),
            title: work.title,
            author: authorData.name,
            authorId: authorId,
            cover: work.covers?.[0] 
              ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg` 
              : '/book-placeholder.png',
            published: work.first_publish_date || 'N/A',
            subjects: work.subjects?.slice(0, 3) || []
          }))
          setBooks(booksData)
        }
      } catch (err) {
        setError('Failed to fetch author details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAuthorDetails()
  }, [authorId])

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
      {/* Author Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/4">
          <img 
            src={author.photo} 
            alt={author.name} 
            className="rounded-lg shadow-lg w-full max-w-xs mx-auto"
          />
        </div>
        
        <div className="md:w-3/4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{author.name}</h1>
          
          <div className="flex items-center mb-6">
            {author.birthDate && (
              <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
                Born: {author.birthDate}
              </span>
            )}
            {author.deathDate && (
              <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                Died: {author.deathDate}
              </span>
            )}
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Biography:</h3>
            <p className="text-gray-700 leading-relaxed">{author.bio}</p>
          </div>
        </div>
      </div>
      
      {/* Author's Books */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Books by {author.name}</h2>
        
        {books.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No books found for this author</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorPage