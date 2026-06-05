import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import Header from './component/Header';
import NoteList from './component/NoteList';
import NoteForm from './component/NoteForm';
import noteService from './component/noteService';

function App() {
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const data = await noteService.getAllNotes();
      setNotes(data);
      setAllNotes(data);
      setError(null);
    } catch (error) {
      setError("Failed to get Data");
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateNotes = async (noteData) => {
    setLoading(true);
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes([newNote, ...notes]);
      setAllNotes([newNote, ...allNotes]);
      setShowForm(false);
      setError(null);
    } catch (error) {
      setError("Failed to create Notes");
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchResults = (searchResults, searchTerm) => {
    console.log('Search results received in App:', searchResults);
    setNotes(searchResults);
    setSearchMode(true);
    setCurrentSearchTerm(searchTerm);
    
    if (searchResults.length === 0) {
      setError(`No notes found containing "${searchTerm}"`);
    } else {
      setError(null);
    }
  };

  const handleClearSearch = () => {
    console.log('Clearing search, showing all notes');
    setNotes(allNotes);
    setSearchMode(false);
    setCurrentSearchTerm('');
    setError(null);
  };

  const handleUpdateNotes = async (id, updateNote) => {
    setLoading(true);
    try {
      const updatedNote = await noteService.updateNote(id, updateNote);
      const updatedNotes = notes.map(note => 
        note.id === id ? updatedNote : note
      );
      setNotes(updatedNotes);
      setAllNotes(updatedNotes);
      setEditingNote(null);
      setShowForm(false);
      setError(null);
    } catch (error) {
      setError("Failed to update Data");
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setLoading(true);
      try {
        await noteService.deleteNote(id);
        const filteredNotes = notes.filter(note => note.id !== id);
        setNotes(filteredNotes);
        setAllNotes(filteredNotes);
        setError(null);
      } catch (error) {
        setError("Failed to delete Note");
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleAddOn = () => {
    setShowForm(true);
    setEditingNote(null);
  }

  const handleEditingClick = (note) => {
    setEditingNote(note);
    setShowForm(true);
  }

  const handleFormSubmit = (noteData) => {
    if (editingNote) {
      handleUpdateNotes(editingNote.id, noteData);
    } else {
      handleCreateNotes(noteData);
    }
  }

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  }

  return (
    <div className="App">
      <Header 
        onSearchResults={handleSearchResults} 
        onClearSearch={handleClearSearch}
        onAdd={handleAddOn}
      />
      
      <Container className="main-content" style={{ padding: '2rem' }}>
        {/* Search Info Banner */}
        {searchMode && (
          <Alert className="search-info-alert" variant="info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>🔍 Search Results for: "{currentSearchTerm}"</strong>
                <br />
                <small>Found {notes.length} note(s)</small>
              </div>
              <Button variant="outline-info" size="sm" onClick={handleClearSearch}>
                Show All Notes
              </Button>
            </div>
          </Alert>
        )}
        
        {/* Error Message */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            <Alert.Heading>⚠️ Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading your notes...</p>
          </div>
        )}
        
        {/* Note Form */}
        {showForm && (
          <NoteForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm} 
            initialData={editingNote} 
            isEditing={!!editingNote}
          />
        )}
        
        {/* Note List */}
        {!loading && notes.length > 0 && !showForm && (
          <NoteList 
            notes={notes} 
            onEdit={handleEditingClick} 
            onDelete={handleDeleteNote} 
            onAdd={handleAddOn}
          />
        )}
        
        {/* Empty State */}
        {!loading && notes.length === 0 && !error && !showForm && (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3>No notes yet</h3>
            <p>Click the "Create New Note" button to get started!</p>
            <Button variant="primary" onClick={handleAddOn}>
              + Create Your First Note
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;