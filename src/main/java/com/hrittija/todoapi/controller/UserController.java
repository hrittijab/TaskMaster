package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.User;
import com.hrittija.todoapi.service.UserService;
import com.hrittija.todoapi.service.EmailService; // ⭐ ADD this import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final EmailService emailService; // ⭐ Add EmailService here

    public UserController(UserService userService, EmailService emailService) { // ⭐ Update constructor
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        String email = user.getEmail().toLowerCase().trim(); // ⭐ normalize
        if (!isValidEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format.");
        }
    
        user.setEmail(email);
        user.setVerified(false);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
    
        boolean success = userService.registerUser(user);
        if (success) {
            // ➡️ Send verification email in try-catch
            try {
                emailService.sendVerificationEmail(email, verificationCode);
            } catch (Exception e) {
                System.err.println("⚠️ Warning: Failed to send verification email to " + email);
                e.printStackTrace();
                // (Optional) you can store a field "emailSent=false" in DB if you want
            }
            return ResponseEntity.ok("Signup successful! Please check your email to verify your account.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }
    }
    

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
            }

            email = email.toLowerCase().trim(); // ⭐ normalize

            if (!isValidEmail(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format.");
            }

            User user = userService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }

            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Please verify your email before logging in.");
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

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam String email) {
        try {
            email = email.toLowerCase().trim(); // ⭐ normalize

            User user = userService.getUserByEmail(email);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user");
        }
    }

    @PutMapping("/{email}/background")
    public ResponseEntity<String> updateBackgroundChoice(@PathVariable String email, @RequestBody String backgroundChoice) {
        email = email.toLowerCase().trim(); // ⭐ normalize

        boolean updated = userService.updateUserBackground(email, backgroundChoice);
        if (updated) {
            return ResponseEntity.ok("Background updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody Map<String, String> verifyRequest) {
        String email = verifyRequest.get("email");
        String code = verifyRequest.get("code");

        if (email == null || code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and verification code are required.");
        }

        email = email.toLowerCase().trim(); // ⭐ normalize

        boolean verified = userService.verifyUser(email, code);
        if (verified) {
            return ResponseEntity.ok("Email verified successfully! You can now log in.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code or email.");
        }
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
