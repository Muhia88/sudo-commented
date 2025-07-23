// src/components/GenreSection.jsx
// Imports React and the useState and useEffect hooks.
import React, { useState, useEffect } from 'react'
// Imports the BookCard component to display individual books.
import BookCard from './BookCard'
// Imports the Link component for navigation.
import { Link } from 'react-router-dom'
// Defines the GenreSection component, which takes a title and genre as props.
const GenreSection = ({ title, genre }) => {
  // State to store the array of books fetched from the API.
  const [books, setBooks] = useState([])
  // State to manage the loading status of the API call.
  const [loading, setLoading] = useState(true)
  // The useEffect hook to fetch books when the component mounts or the genre prop changes.
  useEffect(() => {
    // Defines an asynchronous function to fetch books by genre.
    const fetchBooksByGenre = async () => {
      try {
        // Sets loading to true before starting the fetch.
        setLoading(true)
        // Fetches a limited number of books (4) for the specified genre from the Open Library API.
        const response = await fetch(
          `https://openlibrary.org/subjects/${genre}.json?limit=4`
        )
        // Parses the JSON response from the API.
        const data = await response.json()
        // Checks if the response contains a 'works' array.
        if (data.works) {
          // Maps over the 'works' array to transform the data into a more usable format for the BookCard component.
          const booksData = data.works.map(work => ({
            // Extracts the book's unique ID.
            id: work.key.replace('/works/', ''),
            // Extracts the book's title.
            title: work.title,
            // Extracts the author's name, providing a default if it's missing.
            author: work.authors?.[0]?.name || 'Unknown Author',
            // Extracts the author's unique ID.
            authorId: work.authors?.[0]?.key?.replace('/authors/', ''),
            // Constructs the URL for the book's cover image, with a fallback placeholder.
            cover: (work.cover_id || work.cover_i)
              ? `https://covers.openlibrary.org/b/id/${work.cover_id || work.cover_i}-M.jpg`
              : '/book-placeholder.png',
            // Extracts the first publication year.
            published: work.first_publish_year || 'N/A',
            // Extracts the first few subjects (tags) for the book.
            subjects: work.subject?.slice(0, 3) || []
          }));
          // Updates the state with the formatted book data.
          setBooks(booksData);
        }
      } catch (error) {
        // Logs any errors that occur during the fetch process.
        console.error(`Error fetching ${genre} books:`, error)
      } finally {
        // Sets loading to false after the fetch is complete (whether it succeeded or failed).
        setLoading(false)
      }
    }
    // Calls the fetch function.
    fetchBooksByGenre()
    // The dependency array ensures this effect re-runs only if the 'genre' prop changes.
  }, [genre])
  // If data is loading, it renders a loading spinner.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  // Returns the JSX for the fully rendered component.
  return (
    // The main container for the section.
    <div>
      {/* // A flex container for the section title and the "View All" link. */}
      <div className="flex justify-between items-center mb-4">
        {/* // The title of the genre section. */}
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        {/* // A link to the discover page for the specific genre. */}
        <Link 
          to={`/discover/${genre}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </Link>
      </div>
      {/* // A grid container to display the book cards. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* // Maps over the 'books' array and renders a BookCard for each book. */}
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
// Exports the GenreSection component.
export default GenreSection