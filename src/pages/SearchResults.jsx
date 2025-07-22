import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BookCard from '../components/BookCard'

const SearchResults = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''
  
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    year: '',
    sort: 'relevance'
  })

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`
        
        // Add filters
        if (filters.year) {
          url += `&first_publish_year=${filters.year}`
        }
        
        // Add sorting
        if (filters.sort === 'newest') {
          url += '&sort=new'
        } else if (filters.sort === 'oldest') {
          url += '&sort=old'
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.docs) {
          const booksData = data.docs.slice(0, 20).map(book => ({
            id: book.key.replace('/works/', ''),
            title: book.title,
            author: book.author_name?.[0] || 'Unknown Author',
            authorId: book.author_key?.[0],
            cover: book.cover_i 
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
              : '/book-placeholder.png',
            published: book.first_publish_year || 'N/A',
            subjects: book.subject?.slice(0, 3) || []
          }))
          setBooks(booksData)
        }
      } catch (err) {
        setError('Failed to fetch search results')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    if (searchQuery) {
      fetchSearchResults()
    }
  }, [searchQuery, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
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
        <h1 className="text-3xl font-bold text-gray-800">
          Search Results for: <span className="text-blue-600">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-600">{books.length} books found</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
            <input
              type="number"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              placeholder="e.g. 2020"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      {books.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            Try a different search term or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults