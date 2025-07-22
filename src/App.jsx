// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { auth, db, googleProvider } from './firebase/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'



// Import components
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import AuthorPage from './pages/AuthorPage'
import BookDetail from './pages/BookDetail'
import ReadingList from './pages/ReadingList'
import Discover from './pages/Discover'
import Navbar from './components/Navbar'

// Main App component
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Handle user authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)
      
      if (!docSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          readingList: {}
        })
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          user={user} 
          onSignIn={handleGoogleSignIn} 
          onSignOut={handleSignOut}
        />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/author/:authorId" element={<AuthorPage />} />
            <Route path="/book/:workId" element={<BookDetail user={user} />} />
            <Route path="/reading-list" element={<ReadingList user={user} />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/discover/:genre" element={<Discover />} />
          </Routes>
        </div>
        
        <footer className="bg-white border-t py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© {new Date().getFullYear()} ShelfScope. All book data provided by OpenLibrary.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App