import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('fiction');
  const [category, setCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
        if (category !== 'all') {
          url += `+subject:${encodeURIComponent(category)}`;
        }
        url += '&maxResults=10';
        const result = await axios(url);
        setBooks(result.data.items);
      } catch (err) {
        setError(`Failed to fetch books: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchBooks();
    }
  }, [query, category]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  const openDialog = (book) => {
    setSelectedBook(book);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setSelectedBook(null);
    setShowDialog(false);
  };

  const defaultImage = 'path-to-your-default-image.png'; // Replace with the path to your default image

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error fetching books: {error}</div>;

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="search-container">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search books..."
          className="search-input"
        />
        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="all">All Categories</option>
          <option value="adventure">Adventure</option>
          <option value="documentary">Documentary</option>
          <option value="fiction">Fiction</option>
          <option value="nonfiction">Non-Fiction</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="scifi">Sci-Fi</option>
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="books-container">
        {books.map(book => (
          <div key={book.id} className="book-card" onClick={() => openDialog(book)}>
            <h2 className="book-title">{book.volumeInfo.title}</h2>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || defaultImage}
              alt={book.volumeInfo.title}
              onError={(e) => (e.target.src = defaultImage)}
              className="book-image"
            />
            <p className="book-description">
              {book.volumeInfo.description ? book.volumeInfo.description.substring(0, 150) + '...' : 'Description not available.'}
            </p>
          </div>
        ))}
      </div>

      {showDialog && selectedBook && (
        <div className="dialog">
          <div className="dialog-content">
            <span className="close" onClick={closeDialog}>&times;</span>
            <h2>{selectedBook.volumeInfo.title}</h2>
            <img
              src={selectedBook.volumeInfo.imageLinks?.thumbnail || defaultImage}
              alt={selectedBook.volumeInfo.title}
              className="dialog-book-image"
            />
            <p>{selectedBook.volumeInfo.description || 'No description available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
