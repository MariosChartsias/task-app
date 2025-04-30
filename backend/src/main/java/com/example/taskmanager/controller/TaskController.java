package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	@Autowired
	private TaskRepository taskRepo;

	@GetMapping
	public List<Task> getAll() {
		return taskRepo.findAll();
	}

	@PostMapping
	public Task create(@RequestBody Task t) {
		return taskRepo.save(t);
	}

	@PutMapping("/{id}")
	public Task update(@PathVariable Long id, @RequestBody Task t) {
		t.setId(id);
		return taskRepo.save(t);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		taskRepo.deleteById(id);
	}
}