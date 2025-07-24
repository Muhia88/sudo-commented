// src/components/BookCard.jsx
// Imports the React library.
import React from 'react'
// Imports the Link component for client-side navigation.
import { Link } from 'react-router-dom'

// Defines the BookCard functional component, which receives a 'book' object as a prop.
const BookCard = ({ book }) => {
  // Extracts the author's name from the book object, with a fallback to 'Unknown Author'.
  const author = (book.authors && book.authors[0]) ? book.authors[0].name : 'Unknown Author'
  // Extracts the URL for the book cover image from the book object.
  const coverUrl = book.formats && book.formats['image/jpeg']

  // Returns the JSX for the book card.
  return (
    // The main container for the card with styling and a hover effect.
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      {/* // A link that wraps the image, navigating to the book's detail page when clicked. */}
      {/* The <Link> component is a fundamental part of the React Router library. It's used instead of a regular HTML <a> tag for a very important reason:
       to enable client-side navigation and prevent full-page reload */}
      <Link to={`/book/${book.id}`}>
        {/* // The book cover image. If coverUrl is not available, it uses a placeholder. */}
        {/*  The path /image-placeholder.jpg refers to an image file located in your project's public directory. 
        Any files placed in the public folder are served directly by the development server 
        and are copied to the root of your dist folder during the build process. */}
        <img
          src={coverUrl || '/image-placeholder.jpg'}  
          alt={book.title} 
          className="w-full h-64 object-cover"
        />
      </Link>
      {/* // A container for the card's text content. */}
      <div className="p-4">
        {/* // The book's title. The 'truncate' class prevents long titles from breaking the layout. */}
        <h3 className="font-bold text-lg truncate" title={book.title}>{book.title}</h3>
        {/* // The author's name, which is also a link to the author's page. */}
        <p className="text-gray-600 text-sm">
          {/* encodeURIComponent() is a standard JavaScript function 
          that makes a string safe to be included as a segment in a URL. 
          e.g When you use encodeURIComponent("St. John, J. Allen"),
           it converts the name into a URL-safe string like this:St.%20John%2C%20J.%20Allen*/}
          by <Link 
            to={`/author/${encodeURIComponent(author)}`} 
            className="hover:text-blue-600"
          >
            {author}
          </Link>
        </p>
      </div>
    </div>
  )
}

// Exports the BookCard component.
export default BookCard