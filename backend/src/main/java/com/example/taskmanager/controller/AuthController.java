package com.example.taskmanager.controller;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/register")
	public String register(@RequestBody User user) {
		userRepo.save(user);
		return "Registered";
	}

	@PostMapping("/login")
	public String login(@RequestBody User user) {
		User u = userRepo.findByUsername(user.getUsername());
		if (u != null && u.getPassword().equals(user.getPassword())) {
			return jwtUtil.generateToken(u.getUsername());
		}
		return "Invalid";
	}
}