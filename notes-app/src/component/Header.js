// Header.jsx
import React, { useState } from 'react';
import noteService from './noteService';
// import './Header.css'; // We'll create this

const Header = ({ onSearchResults, onClearSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Handle search by title containing keyword
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    try {
      // Search notes by title containing the keyword
      const results = await noteService.getNotesByTitleContaining(searchTerm);
      
      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults(results, searchTerm);
      }
      
      setShowSearchDropdown(false);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching notes');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle real-time suggestions as user types
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      try {
        // Get suggestions for auto-complete
        const suggestions = await noteService.getNotesByTitleStartingWith(value);
        setSuggestions(suggestions.slice(0, 5)); // Show top 5 suggestions
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSearchDropdown(false);
    // Auto search when suggestion is clicked
    setTimeout(() => handleSearch(), 100);
  };

  // Clear search and show all notes
  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSearchDropdown(false);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Brand */}
        <div className="logo">
          <h1>📝 MyNotes</h1>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search notes by title..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => searchTerm && setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            />
            
            {/* Search Button */}
            <button 
              className="search-button"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? '🔍 Searching...' : '🔍 Search'}
            </button>
            
            {/* Clear Button */}
            {searchTerm && (
              <button 
                className="clear-button"
                onClick={handleClearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSearchDropdown && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((note) => (
                <div 
                  key={note.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(note)}
                >
                  <span className="suggestion-title">📄 {note.title}</span>
                  <span className="suggestion-preview">
                    {note.content?.substring(0, 50)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation / User Info */}
        <div className="nav-links">
          <button className="nav-button" onClick={onClearSearch}>
            All Notes
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
