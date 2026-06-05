// Api_Service.java - Using ConcurrentHashMap as in-memory storage
package com.NUKG.Project.MyNotes.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.NUKG.Project.MyNotes.Entity.Note;

import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class Api_Service {
    
    @Autowired(required = false)
    private ApplicationContext applicationContext;
    
    // In-memory storage (simulates localStorage)
    private final Map<Long, Note> noteStorage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    
    @PostConstruct
    public void init() {
        System.out.println("=== Api_Service Initialized ===");
        System.out.println("ApplicationContext available: " + (applicationContext != null));
        System.out.println("In-memory storage ready (simulating localStorage)");
    }
    // Business logic: Get all non-deleted notes
    public List<Note> fetchAllNotes() {
        List<Note> notes = noteStorage.values().stream()
            .filter(note -> !note.isDeleted())
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
        
        System.out.println("Fetched " + notes.size() + " active notes");
        return notes;
    }
    
    // Business logic: Get single note
    public Note getNote(Long id) {
        Note note = noteStorage.get(id);
        if (note == null || note.isDeleted()) {
            throw new RuntimeException("Note not found with id: " + id);
        }
        return note;
    }
    
    // Business logic: Create new note
    public Note createNote(Note note) {
        // Validation
        if (note.getTitle() == null || note.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        
        Long newId = idGenerator.getAndIncrement();
        note.setId(newId);
        note.setCreatedAt(LocalDateTime.now());
        note.setDeleted(false);
        
        noteStorage.put(newId, note);
        System.out.println("Created note with id: " + newId);
        
        return note;
    }
    public List<Note> getNotesByTitleContaining(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return fetchAllNotes(); // Return all notes if no keyword
        }
        
        List<Note> notes = noteStorage.values().stream()
            .filter(note -> !note.isDeleted()) // Only active notes
            .filter(note -> note.getTitle().toLowerCase()
                .contains(keyword.toLowerCase().trim()))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
        
        System.out.println("Found " + notes.size() + " notes containing: " + keyword);
        return notes;
    }
    // Business logic: Update note
    public Note updateNote(Long id, Note noteDetails) {
        Note existingNote = noteStorage.get(id);
        
        if (existingNote == null || existingNote.isDeleted()) {
            throw new RuntimeException("Note not found with id: " + id);
        }
        
        // Update fields
        if (noteDetails.getTitle() != null) {
            existingNote.setTitle(noteDetails.getTitle());
        }
        if (noteDetails.getContent() != null) {
            existingNote.setContent(noteDetails.getContent());
        }
        
        noteStorage.put(id, existingNote);
        System.out.println("Updated note with id: " + id);
        
        return existingNote;
    }
    
    // Business logic: Soft delete note
    public void deleteNote(Long id) {
        Note note = noteStorage.get(id);
        if (note != null) {
            note.setDeleted(true);
            noteStorage.put(id, note);
            System.out.println("Deleted note with id: " + id);
        }
    }
    
    // Business logic: Get all notes (including deleted)
    public List<Note> getAllNotesIncludingDeleted() {
        return new ArrayList<>(noteStorage.values());
    }
    
    // Business logic: Permanently delete a note (hard delete)
    public void permanentlyDeleteNote(Long id) {
        noteStorage.remove(id);
        System.out.println("Permanently deleted note with id: " + id);
    }
    
    // Business logic: Restore a deleted note
    public Note restoreNote(Long id) {
        Note note = noteStorage.get(id);
        if (note != null && note.isDeleted()) {
            note.setDeleted(false);
            noteStorage.put(id, note);
            System.out.println("Restored note with id: " + id);
            return note;
        }
        throw new RuntimeException("Cannot restore note with id: " + id);
    }
    
    // Business logic: Get statistics
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNotes", noteStorage.size());
        stats.put("activeNotes", fetchAllNotes().size());
        stats.put("deletedNotes", noteStorage.values().stream().filter(Note::isDeleted).count());
        stats.put("storageType", "In-Memory (simulating localStorage)");
        return stats;
    }
}