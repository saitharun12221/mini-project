import React from "react";
import NoteCard from "./NoteCard";
function NoteList({notes,onEdit,onDelete,onAdd}){
    return(
        <div className="container-list">
            <div className="list-header">
                <h2>My Notes ({notes.length})</h2>
                <button className="add-btn" onClick={onAdd}>+ New Note</button>
            </div>
            <div className="Notes">
                {notes.length===0?(
                    <div className="empty-state">
                    No notes yet. Click on New Notes to get Started.
                    </div>
                ):(
                    notes.map(note=>(
                        <NoteCard key={note.id} title={note.title} content={note.content} onEdit={()=>onEdit(note)} onDelete={()=>onDelete(note.id)}/>
                    )
                )
                )
            }
            </div>
        </div>
    )
}
export default NoteList;