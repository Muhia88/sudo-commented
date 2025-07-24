import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { auth, db, googleProvider } from './firebase/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Page Imports
import LoginPage from './pages/LoginPage';
import ChoosePath from './pages/ChoosePath';
import ErrorPage from './pages/ErrorPage'; 

// Read Page Imports
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AuthorPage from './pages/AuthorPage';
import BookDetail from './pages/BookDetail';
import ReadingList from './pages/ReadingList';
import Discover from './pages/Discover';


// Listen Path Imports
import ListenHomePage from './pages/listen/ListenHomePage';
import DiscoverAudioBooks from './pages/listen/DiscoverAudioBooks';
import MyListens from './pages/listen/MyListens';
import AudioBookDetail from './pages/listen/AudioBookDetail';
import AudioBookSearchResults from './pages/listen/AudioBookSearchResults';


// Component Imports
import Navbar from './components/Navbar';
import ListenNavbar from './components/listen/ListenNavbar';

/**
 * ReadLayout is a layout component for the "Read" section of the app.
 * It includes the main navbar and a footer.
 * The actual page content is rendered via the <Outlet /> component from React Router.
 * @param {object} props - Component props.
 * @param {object} props.user - The current user object.
 * @param {Function} props.onSignOut - Function to handle user sign-out.
 * @returns {JSX.Element} - The layout for the "Read" section.
 */
const ReadLayout = ({ user, onSignOut }) => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Navbar user={user} onSignOut={onSignOut} />
    <main className="container mx-auto px-4 py-8 flex-1">
      <Outlet />
    </main>
    <footer className="bg-white border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} ShelfScope.</p>
      </div>
    </footer>
  </div>
);

/**
 * ListenLayout is a layout component for the "Listen" section of the app.
 * It includes the listen-specific navbar and a footer.
 * @param {object} props - Component props.
 * @param {object} props.user - The current user object.
 * @param {Function} props.onSignOut - Function to handle user sign-out.
 * @returns {JSX.Element} - The layout for the "Listen" section.
 */
const ListenLayout = ({ user, onSignOut }) => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <ListenNavbar user={user} onSignOut={onSignOut} />
    <main className="container mx-auto px-4 py-8 flex-1">
      <Outlet />
    </main>
    <footer className="bg-white border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} ShelfScope.</p>
      </div>
    </footer>
  </div>
);


/**
 * App is the root component of the application.
 * It handles the main routing logic and user authentication state.
 * @returns {JSX.Element} - The root JSX element.
 */
const App = () => {
  // State to hold the current user's authentication status.
  const [user, setUser] = useState(null);
  // State to manage the initial loading state while checking for an active user session.
  const [loading, setLoading] = useState(true);

  // Effect to listen for changes in the authentication state.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    // Cleanup subscription on component unmount.
    return unsubscribe;
  }, []);

  // Show a loading spinner during the initial authentication check.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Wrap the main application logic in the Router.
  return (
    <Router>
      <MainApp user={user} setUser={setUser} />
    </Router>
  );
};

/**
 * MainApp contains the core application logic, including routing and authentication handling.
 * It's a separate component to be able to use React Router hooks like useNavigate and useLocation.
 * @param {object} props - Component props.
 * @param {object} props.user - The current user object.
 * @param {Function} props.setUser - Function to set the user state.
 * @returns {JSX.Element} - The main application routes.
 */
const MainApp = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

   /**
   * Handles the Google sign-in process.
   * On successful sign-in, it creates a user document in Firestore if it doesn't exist.
   */
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      //Check if the user document already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      // If the user is new, create a new document for them
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          readingList: {},
          listenList: {}
        });
      }
      setUser(user);
      navigate('/choose-path');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  //Handles the sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  //handles routing based on authentication status
  useEffect(() => {
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    // If the user is not logged in and not on a public route, redirect to the login page.
    if (!user && !isPublicRoute) {
      navigate('/login');
    } else if (user && isPublicRoute) {
       // If the user is logged in and on a public route, redirect to the path selection page.
      navigate('/choose-path');
    }
  }, [user, location.pathname, navigate]);

  // If there is no user, only render the login route. Also include a catch-all for unknown paths.
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onSignIn={handleGoogleSignIn} />} />
        {/* For an unauthenticated user, any other path will also lead to the login page. */}
        <Route path="*" element={<LoginPage onSignIn={handleGoogleSignIn} />} />
      </Routes>
    )
  }

  // If a user is logged in, render all the application routes
  return (
      <Routes>
        <Route path="/choose-path" element={<ChoosePath onSignOut={handleSignOut} />} />

        {/* Read Path */}
        <Route element={<ReadLayout user={user} onSignOut={handleSignOut} />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/author/:authorName" element={<AuthorPage />} />
          <Route path="/book/:bookId" element={<BookDetail user={user} />} />
          <Route path="/my-list" element={<ReadingList user={user} />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/:genre" element={<Discover />} />
        </Route>

        {/* Listen Path */}
        <Route element={<ListenLayout user={user} onSignOut={handleSignOut} />}>
            <Route path="/listen" element={<ListenHomePage />} />
            <Route path="/listen/search" element={<AudioBookSearchResults />} />
            <Route path="/discover-audiobooks" element={<DiscoverAudioBooks />} />
            <Route path="/discover-audiobooks/:genre" element={<DiscoverAudioBooks />} />
            <Route path="/my-listens" element={<MyListens user={user} />} />
            <Route path="/audiobook/:audioBookId" element={<AudioBookDetail user={user} />} />
        </Route>

        {/* This is the catch-all route. */}
        <Route path="*" element={<ErrorPage />} />

      </Routes>
  );
};

export default App;