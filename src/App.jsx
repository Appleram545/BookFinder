import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(18); 

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      const data = await res.json();

      if (data.docs?.length) {
        setBooks(data.docs);
        setVisible(18);
        setStatus("");
      } else {
        setBooks([]);
        setStatus("No books found.");
      }
    } catch {
      setStatus("Failed to fetch data. Try again.");
    }
  };

  const loadMore = () => setVisible((prev) => prev + 18);

  return (
    <div className="app">
      <h1>📚 Book Finder</h1>

      <form onSubmit={searchBooks}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {status === "loading" && <p className="loading">Loading...</p>}
      {status && status !== "loading" && <p className="error">{status}</p>}

      <div className="book-list">
        {books.slice(0, visible).map((b, i) => (
          <div className="book-card" key={i}>
            <img
              src={
                b.cover_i
                  ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
                  : "https://placehold.co/150x200?text=No+Cover"
              }
              alt={b.title}
            />
            <h3>{b.title}</h3>
            <p>{b.author_name?.join(", ") || "Unknown Author"}</p>
            <p className="year">{b.first_publish_year || "N/A"}</p>
          </div>
        ))}
      </div>

      {books.length > visible && (
        <div className="load-more-container">
          <button className="load-more" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
