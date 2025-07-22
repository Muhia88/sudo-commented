// src/components/BookCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const BookCard = ({ book, showProgress = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
      <div className="p-4">
        <div className="flex">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={book.cover} 
              alt={book.title} 
              className="w-24 h-36 object-cover rounded"
            />
          </div>
          
          <div className="flex-1">
            <Link to={`/book/${book.id}`} className="block">
              <h3 className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
                {book.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mb-2">
              by <Link 
                to={`/author/${book.authorId}`} 
                className="hover:text-blue-600 hover:underline"
              >
                {book.author}
              </Link>
            </p>
            
            {book.published && (
              <p className="text-gray-500 text-xs mb-2">
                Published: {book.published}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-3">
              {book.subjects?.slice(0, 2).map((subject, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {subject}
                </span>
              ))}
            </div>
            
            {showProgress && book.progress && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {book.currentPage} of {book.pages} pages ({Math.round(book.progress)}%)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <Link 
          to={`/book/${book.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>
        
        <Link 
          to={`/book/${book.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >
          {showProgress ? 'Continue' : 'Read'}
        </Link>
      </div>
    </div>
  )
}

export default BookCard