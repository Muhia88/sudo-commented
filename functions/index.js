// Imports the Firebase Functions SDK, which is necessary to create and manage Cloud Functions.
const functions = require("firebase-functions");
// Imports the node-fetch library, which allows making HTTP requests from a Node.js environment, similar to the browser's fetch API.
const fetch = require("node-fetch");
// Imports and configures the 'cors' middleware. The { origin: true } option allows requests from any origin, which is useful for a public API proxy.
const cors = require("cors")({ origin: true });

// Defines and exports a new HTTPS Cloud Function named 'getBookText'. It's triggered by an HTTP request.
exports.getBookText = functions.https.onRequest((request, response) => {
  // Wraps the function's logic with the CORS middleware to handle pre-flight requests and add the necessary CORS headers to the response.
  cors(request, response, async () => {
    // Retrieves the 'url' query parameter from the incoming request URL.
    const textUrl = request.query.url;
    // If no URL is provided in the query string, sends a 400 Bad Request error response.
    if (!textUrl) {
      return response.status(400).send("No URL provided.");
    }
    try {
      // Fetches the content from the decoded URL. `decodeURIComponent` is used to handle special characters in the URL.
      const fetchResponse = await fetch(decodeURIComponent(textUrl));
      // If the fetch request was not successful (e.g., 404 Not Found), sends an error response with the same status code.
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch book content.");
      }
      // Extracts the text content from the successful fetch response.
      const textData = await fetchResponse.text();
      // Sends a 200 OK response back to the client with the fetched text data.
      return response.status(200).send(textData);
    } catch (error) {
      // If any other error occurs during the process, sends a 500 Internal Server Error response.
      return response.status(500).send("An error occurred while fetching the book text.");
    }
  });
});

// Defines and exports another HTTPS Cloud Function named 'getLibrivoxData' to act as a proxy for the LibriVox API.
exports.getLibrivoxData = functions.https.onRequest((request, response) => {
  // Wraps the function's logic with the CORS middleware.
  cors(request, response, async () => {
    // Retrieves the LibriVox API URL from the request's query parameters.
    const librivoxUrl = request.query.url;
    // If no URL is provided, sends a 400 Bad Request error.
    if (!librivoxUrl) {
      return response.status(400).send("No LibriVox API URL provided.");
    }
    try {
      // Fetches data from the decoded LibriVox API URL.
      const fetchResponse = await fetch(decodeURIComponent(librivoxUrl));
      // Checks if the fetch was successful.
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch from LibriVox API.");
      }
      // Parses the JSON data from the successful response.
      const data = await fetchResponse.json();
      // Sends the parsed JSON data back to the client with a 200 OK status.
      return response.status(200).json(data);
    } catch (error) {
      // Catches any other errors and sends a 500 Internal Server Error.
      return response.status(500).send("An error occurred while fetching from LibriVox.");
    }
  });
});

// Defines and exports a third HTTPS Cloud Function to proxy requests to the Open Library API, primarily for book covers.
exports.getOpenLibraryData = functions.https.onRequest((request, response) => {
  // Wraps the function's logic with the CORS middleware.
  cors(request, response, async () => {
    // Retrieves the Open Library API URL from the request's query parameters.
    const openLibraryUrl = request.query.url;
    // If no URL is provided, sends a 400 Bad Request error.
    if (!openLibraryUrl) {
      return response.status(400).send("No Open Library API URL provided.");
    }
    try {
      // Fetches data from the decoded Open Library API URL.
      const fetchResponse = await fetch(decodeURIComponent(openLibraryUrl));
      // Checks if the fetch was successful.
      if (!fetchResponse.ok) {
        return response.status(fetchResponse.status).send("Failed to fetch from Open Library API.");
      }
      // Parses the JSON data from the successful response.
      const data = await fetchResponse.json();
      // Sends the parsed JSON data back to the client with a 200 OK status.
      return response.status(200).json(data);
    } catch (error) {
      // Catches any other errors and sends a 500 Internal Server Error.
      return response.status(500).send("An error occurred while fetching from Open Library.");
    }
  });
});