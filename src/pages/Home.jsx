// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import GenreSection from '../components/GenreSection'

const Home = () => {
  const [trendingBooks, setTrendingBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch trending books from OpenLibrary
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://openlibrary.org/trending/daily.json?limit=12'
        )
        const data = await response.json()
        
        if (data.works) {
          const books = data.works.map(work => ({
            id: work.key.replace('/works/', ''),
            title: work.title,
            author: work.author_name?.[0] || 'Unknown Author',
            cover: work.cover_id 
              ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg` 
              : '/book-placeholder.png',
            published: work.first_publish_year || 'N/A',
            rating: work.ratings_average || 0,
            ratingsCount: work.ratings_count || 0,
            subjects: work.subject?.slice(0, 3) || []
          }))
          setTrendingBooks(books)
        }
      } catch (err) {
        setError('Failed to fetch trending books')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrendingBooks()
  }, [])

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mb-12 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Favorite Book</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore millions of books, find recommendations, and build your personal reading list.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#trending" 
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition duration-200"
            >
              Browse Trending
            </a>
            <a 
              href="/discover" 
              className="border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition duration-200"
            >
              Explore Genres
            </a>
          </div>
        </div>
      </section>
      
      {/* Trending Books */}
      <section id="trending" className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Trending Books Today</h2>
          <a 
            href="/discover" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      {/* Popular Genres */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Genres</h2>
        <div className="space-y-12">
          <GenreSection 
            title="Science Fiction" 
            genre="science_fiction"
          />
          <GenreSection 
            title="Mystery & Thriller" 
            genre="mystery"
          />
          <GenreSection 
            title="Romance" 
            genre="romance"
          />
        </div>
      </section>
    </div>
  )
}

export default Home