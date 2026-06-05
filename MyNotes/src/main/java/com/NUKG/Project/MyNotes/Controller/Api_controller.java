// NoteController.java
package com.NUKG.Project.MyNotes.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.NUKG.Project.MyNotes.Entity.Note;
import com.NUKG.Project.MyNotes.Service.Api_Service;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class Api_controller {
    
    // Direct injection (simpler)
    @Autowired
    private Api_Service apiService;
    
    // If you want to use ApplicationContext
    @Autowired
    private ApplicationContext applicationContext;
    
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        // Using direct injection
        List<Note> notes = apiService.fetchAllNotes();
        return ResponseEntity.ok(notes);
    }
    @GetMapping("/search/containing")
    public ResponseEntity<List<Note>> getNotesByTitleContaining(@RequestParam String keyword) {
        Api_Service service = applicationContext.getBean(Api_Service.class);
        List<Note> notes = service.getNotesByTitleContaining(keyword);
        return ResponseEntity.ok(notes);
    }
    
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note createdNote = apiService.createNote(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        Note updatedNote = apiService.updateNote(id, note);
        return ResponseEntity.ok(updatedNote);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        apiService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = apiService.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/{id}/restore")
    public ResponseEntity<Note> restoreNote(@PathVariable Long id) {
        Note restoredNote = apiService.restoreNote(id);
        return ResponseEntity.ok(restoredNote);
    }
}