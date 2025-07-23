// src/main.jsx

// Import the React library, which is necessary for writing React components.
import React from 'react';
// Import ReactDOM, which provides methods for rendering React components into the DOM.
import ReactDOM from 'react-dom/client';
// Import the main App component, which is the root of the React application.
import App from './App';
// Import the main CSS file for the application, which includes Tailwind CSS.
import './index.css';

// Use ReactDOM to create a root for the React application.
// This targets the DOM element with the ID 'root' in the index.html file.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a tool for highlighting potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  <React.StrictMode>
    {/* Render the main App component inside the StrictMode wrapper. */}
    <App />
  </React.StrictMode>
);