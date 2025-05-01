package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for Task-related operations.
 * Provides endpoints for CRUD operations on tasks.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	@Autowired
	private TaskRepository taskRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Get all tasks for the authenticated user.
	 * 
	 * @param authorization JWT token in the Authorization header
	 * @return List of tasks
	 */
	@GetMapping
	public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authorization) {
		try {
			List<Task> tasks = taskRepo.findAll();
			return ResponseEntity.ok(tasks);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		}
	}

	/**
	 * Create a new task.
	 * 
	 * @param task The task data
	 * @param authorization JWT token in the Authorization header
	 * @return The created task
	 */
	@PostMapping
	public ResponseEntity<?> create(@RequestBody Task task, @RequestHeader("Authorization") String authorization) {
		try {
			Task savedTask = taskRepo.save(task);
			return ResponseEntity.ok(savedTask);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		}
	}

	/**
	 * Update an existing task.
	 * 
	 * @param id Task ID to update
	 * @param task Updated task data
	 * @param authorization JWT token in the Authorization header
	 * @return The updated task
	 */
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Task task, 
			@RequestHeader("Authorization") String authorization) {
		try {
			
			Optional<Task> existingTask = taskRepo.findById(id);
			if (!existingTask.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
			}
			
			task.setId(id);
			Task updatedTask = taskRepo.save(task);
			return ResponseEntity.ok(updatedTask);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		}
	}

	/**
	 * Delete a task.
	 * 
	 * @param id Task ID to delete
	 * @param authorization JWT token in the Authorization header
	 * @return Success message
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authorization) {
		try {
			
			Optional<Task> existingTask = taskRepo.findById(id);
			if (!existingTask.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
			}
			
			taskRepo.deleteById(id);
			return ResponseEntity.ok("Task deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		}
	}
}