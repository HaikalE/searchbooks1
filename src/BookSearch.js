import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); 
  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=20`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setStartIndex(startIndex + 20);
    searchBooks();
  };

  const handlePrevPage = () => {
    if (startIndex >= 20) {
      setStartIndex(startIndex - 20);
      searchBooks();
    }
  };
  const handleBookClick = (book) => {
    setSelectedBook(book); // Set the selected book when clicked
  };

  const handleCloseDetails = () => {
    setSelectedBook(null); // Clear selected book when closing details
  };
  return (
    <div className="container mx-auto mt-8 px-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books..."
        className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4"
      />
      <button
        onClick={searchBooks}
        className="px-6 py-3 bg-blue-500 text-white rounded-md"
      >
        Search
      </button>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-2 md:col-span-3 flex items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          books.map((book) => (
            
            <div key={book.id} className="border border-gray-300 p-4 rounded-md text-center" onClick={() => handleBookClick(book)}>
              <img
                src={
                  book.volumeInfo.imageLinks
                    ? book.volumeInfo.imageLinks.thumbnail
                    : 'https://via.placeholder.com/150'
                }
                alt={book.volumeInfo.title}
                className="w-full h-60 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold ">{book.volumeInfo.title}</h2>
              <p className="text-sm text-gray-600">
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(', ')
                  : 'Author Unknown'}
              </p>
            </div>
          ))
        )}
      </div>
      {books.length > 0 && ( // Display pagination only if there are search results
      <div className="mt-8 flex flex-col md:flex-row md:justify-between">
        {startIndex >= 20 && (
          <button
            onClick={handlePrevPage}
            className="w-full md:w-auto mb-2 md:mb-0 md:mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Previous Page
          </button>
        )}
        {books.length === 20 && (
          <button
            onClick={handleNextPage}
            className="w-full md:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Next Page
          </button>
        )}
      </div>
    )}

      {/* Details Modal or Section */}
      {selectedBook && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white p-8 rounded-md max-w-md w-full mx-4 sm:mx-auto">
      <button onClick={handleCloseDetails} className="float-right">
        Close
      </button>
      {/* Display book details */}
      <h2 className="text-lg font-semibold">{selectedBook.volumeInfo.title}</h2>
      <p className="text-sm text-gray-600">
        {selectedBook.volumeInfo.authors
          ? selectedBook.volumeInfo.authors.join(', ')
          : 'Author Unknown'}
      </p>
      {/* Display book description */}
      <p className="text-sm text-gray-600 mt-4">
        {selectedBook.volumeInfo.description
          ? selectedBook.volumeInfo.description
          : 'No description available'}
      </p>
      {/* Add more details as needed */}
    </div>
  </div>
)}


    </div>
  );
};

export default BookSearch;
