import React from "react";
function NoteCard({key,title,content,onEdit,onDelete}){
    const getPreview = (content)=>{
        if (!content){
            return "NoContent";
        }
        if (content.length<=50){
            return content;
        }
        return content.subString(0,50)+"...";
    }
    return(
        <div>
            <div className="card">
                <div className="title">{title || "Untitled Note"}</div>
                <div className="preview">{getPreview(content)}</div>
                <div className="actions">
                    <button className="edit" onClick={onEdit}>Edit</button>
                    <button className="delete" onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}
export default NoteCard;