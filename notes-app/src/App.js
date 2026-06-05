import React,{useState,useEffect} from 'react';
import Header from './component/Header';
import NoteList from './component/NoteList';
import NoteForm from './component/NoteForm';
import noteService from './component/noteService';
function App() {
  const [notes,setNotes] = useState([]);
  const [allNotes,setAllNotes]= useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [showForm,setShowForm] = useState(false);
  const [searchMode,setSearchMode]=useState(false);
  const [currentSearchTerm , setCurrentSearchTerm]= useState('');
  const [editingNote,setEditingNote]= useState(null);
  useEffect(()=>{
    fetchAllData();
  },[]);
  const fetchAllData = async ()=>{
      setLoading(true);
      try{
        const data = await noteService.getAllNotes();
        setNotes(data);
        setError(null);
      }
      catch(error){
        setError("Failed to get Data");
        console.error("error",error);
      }
      finally{
        setLoading(false);
      }
  }
  const handleCreateNotes = async (noteData)=>{
      setLoading(true);
      try{
        const newNote = await noteService.createNote(noteData);
        setNotes([...notes,newNote]);
        setShowForm(false);
        setError(null);
      }
      catch(error){
        setError("Failed to create Notes");
        console.error("error",error);
      }
      finally{
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
  const handleUpdateNotes = async (id,updateNote)=>{
      setLoading(true);
      try{
        const updatedNote = await noteService.updateNote(id,updateNote);
        const updateNotes = notes.map(note=>(
          note.id===id?updatedNote:note
        ));
        setNotes(updateNotes);
        setEditingNote(null);
        setShowForm(false);
        setError(null);
      }
      catch(error){
        setError("Failed to update Data");
        console.error("error",error);
      }
      finally{
        setLoading(false);
      }
  }
  const handleDeleteNote = async (id)=>{
      
      if (window.confirm("Are you sure you want to delete this note?")){
        setLoading(true);
        try{
           await noteService.deleteNote(id);
           const filterNote = notes.filter(note=> (note.id!==id));
           setNotes(filterNote);
           setError(null);
          }
          catch(error){
            setError("Failed to delete Note");
            console.error("error",error);
          }
          finally{
            setLoading(false);
          }
      }
      
  }
  const handleAddOn = ()=>{
    setShowForm(true);
  }
 const handleEditingClick =(note)=>{
      setEditingNote(note);
      setShowForm(true);
 }
 const handleFormSubmit =(noteData)=>{
      if (editingNote){
        handleUpdateNotes(editingNote.id,noteData);
      }
      else{
        handleCreateNotes(noteData);
      }
 }
 const handleCloseForm =()=>{
      setShowForm(false);
      setEditingNote(null);
 }
    return (
    <div className="App">
        <Header className="app-header" onSearchResults={handleSearchResults} onClearSearch={handleClearSearch}/>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}
        {showForm && 
        (<NoteForm onSubmit={handleFormSubmit} onCancel={handleCloseForm} initialData={editingNote} isEditing={!!editingNote}/>)}
        <NoteList notes={notes} onEdit={handleEditingClick} onDelete={handleDeleteNote} onAdd={handleAddOn}/>
    </div>
  );
}

export default App;
