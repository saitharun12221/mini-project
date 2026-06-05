import React from "react";
import { Card, Button } from "react-bootstrap";

function NoteCard({ key,title,content, onEdit, onDelete }) {
  const getPreview = (content) => {
    if (!content) {
      return "No Content";
    }
    if (content.length <= 50) {
      return content;
    }
    return content.substring(0, 50) + "...";
  };

  return (
    <Card className="h-100 shadow-sm" style={{ transition: "transform 0.2s" }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">
            {title}
          </Card.Title>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-1"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        <Card.Text style={{ color: "#666", lineHeight: "1.5" }}>
          {getPreview(content)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default NoteCard;