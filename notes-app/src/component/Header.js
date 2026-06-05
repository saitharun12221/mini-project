// Header.jsx
import React, { useState } from 'react';
import { Navbar, Container, Form, InputGroup, Button } from 'react-bootstrap';
import noteService from './noteService';

const Header = ({ onSearchResults, onClearSearch, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Handle search by title containing keyword
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await noteService.getNotesByTitleContaining(searchTerm);
      
      if (onSearchResults) {
        onSearchResults(results, searchTerm);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching notes');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length === 0 && onClearSearch) {
      onClearSearch();
    }
  };

  // Clear search and show all notes
  const handleClearSearch = () => {
    setSearchTerm('');
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
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container fluid>
        <Navbar.Brand href="#" className="d-flex align-items-center" onClick={handleClearSearch}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📝</span>
          <strong>MyNotes</strong>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <div className="mx-auto" style={{ flex: 1, maxWidth: '500px' }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search notes by title..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
              {searchTerm && (
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
              <Button variant="light" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </InputGroup>
          </div>
          
          <Button variant="success" onClick={onAdd} className="ms-lg-2 mt-2 mt-lg-0">
            + Create Note
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;