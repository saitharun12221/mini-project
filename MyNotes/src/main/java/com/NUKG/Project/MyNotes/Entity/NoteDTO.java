package com.NUKG.Project.MyNotes.Entity;

public class NoteDTO {
	private String title;
	private String content;
	public NoteDTO() {
		// Default constructor
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
