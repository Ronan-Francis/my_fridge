import React from "react";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
}

export default SearchBar;