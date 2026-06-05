// component/NoteForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

function NoteForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || ''
      });
    } else {
      setFormData({
        title: '',
        content: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    setError('');
    onSubmit(formData);
  }

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setError('');
    onCancel();
  }

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">{isEditing ? '✏️ Edit Note' : '📝 Create New Note'}</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Content *</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={6}
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={handleChange}
            />
          </Form.Group>
          
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              {isEditing ? 'Update Note' : 'Create Note'}
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default NoteForm;