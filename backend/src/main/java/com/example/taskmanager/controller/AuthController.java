package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for authentication operations.
 * Handles user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Register a new user.
	 * 
	 * @param user User data with username and password
	 * @return Success response or error
	 */
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		try {
			// Check if username already exists
			User existingUser = userRepo.findByUsername(user.getUsername());
			if (existingUser != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body("Username already exists");
			}
			
			// Save the new user
			userRepo.save(user);
			
			Map<String, String> response = new HashMap<>();
			response.put("message", "User registered successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error during registration: " + e.getMessage());
		}
	}

	/**
	 * Authenticate a user and generate JWT token.
	 * 
	 * @param user User credentials
	 * @return JWT token or error message
	 */
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {
		try {
			User existingUser = userRepo.findByUsername(user.getUsername());
			
			// Validate username and password
			if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
				String token = jwtUtil.generateToken(existingUser.getUsername());
				
				Map<String, String> response = new HashMap<>();
				response.put("token", token);
				response.put("username", existingUser.getUsername());
				
				return ResponseEntity.ok(response);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body("Invalid username or password");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error during login: " + e.getMessage());
		}
	}
}