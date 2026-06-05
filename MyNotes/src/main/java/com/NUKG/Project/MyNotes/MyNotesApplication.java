package com.NUKG.Project.MyNotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class MyNotesApplication {

	public static void main(String[] args) {
		ApplicationContext context=SpringApplication.run(MyNotesApplication.class, args);
		System.out.println("=== MyNotesApplication Started ===");
		System.out.println("ApplicationContext: " + context);
	}

}
