import React,{useState,useEffect} from "react";
function NoteForm({onSubmit,onCancel, initialData,isEditing}){
    const [formData,setFormData] = useState({
        title:"",
        content:""
    }
    );
    useEffect(()=>{
        if (initialData){
            setFormData({
                title:initialData.title||'',
                content:initialData.content||''
        });
    }else{
            setFormData({
                title:'',
                content:''
            });
        }
    },[initialData]);
    const handleChange =(e)=>{
        const {name,value}=e.target;
        setFormData(prev=>(
            {
                ...prev,[name]:value
            }
        ));
    }
    const handleSubmit= (e)=>{
        e.preventDefault();
        if (formData.title.trim() &&  formData.content.trim()){
            onSubmit(formData);
        }
    }
    return(
        <div className="layout">
            <div className="content">
                 <h2>{isEditing?"Edit Mode" : "Create on New Note"}</h2>
                 <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="enter the title" required/>
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} placeholder="write your notes..." rows="6" required/>
                    </div>
                    <div className="form-actions">
                       <button type="submit" className="submit-btn">
                        {isEditing?"Update":"Save"}
                       </button>
                       <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                    </div>
                 </form>
            </div>
        </div>
    )
}
export default NoteForm;