package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.User;
import com.hrittija.todoapi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        boolean success = userService.registerUser(user);
        if (success) {
            return ResponseEntity.ok("Signup successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
            }

            boolean loginSuccess = userService.loginUser(email, password);
            if (loginSuccess) {
                return ResponseEntity.ok("Login successful");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid login request format");
        }
    }

    // ⭐ Get User by Email endpoint
    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam String email) {
        try {
            User user = userService.getUserByEmail(email);
            if (user != null) {
                return ResponseEntity.ok(user); // returns full User object (JSON with firstName, lastName, etc.)
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user");
        }
    }
}
