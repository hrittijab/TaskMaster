package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.User;
import com.hrittija.todoapi.service.EmailService;
import com.hrittija.todoapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private UserService userService;
    private EmailService emailService;
    private UserController userController;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        emailService = mock(EmailService.class);
        userController = new UserController(userService, emailService);
    }

    @Test
    void testSignup_Success() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.registerUser(any(User.class))).thenReturn(true);

        ResponseEntity<String> response = userController.signup(user);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Signup successful"));
        verify(emailService, times(1)).sendVerificationEmail(eq("test@example.com"), anyString());
    }

    @Test
    void testSignup_InvalidEmail() {
        User user = new User();
        user.setEmail("invalidemail");

        ResponseEntity<String> response = userController.signup(user);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid email format.", response.getBody());
        verify(userService, never()).registerUser(any());
    }

    @Test
    void testSignup_EmailAlreadyExists() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.registerUser(any(User.class))).thenReturn(false);

        ResponseEntity<String> response = userController.signup(user);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Email already exists", response.getBody());
    }

    @Test
    void testLogin_Success() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setVerified(true);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "password123");

        when(userService.getUserByEmail("test@example.com")).thenReturn(user);
        when(userService.loginUser("test@example.com", "password123")).thenReturn(true);

        ResponseEntity<String> response = userController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Login successful", response.getBody());
    }

    @Test
    void testLogin_UnverifiedUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setVerified(false);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "password123");

        when(userService.getUserByEmail("test@example.com")).thenReturn(user);

        ResponseEntity<String> response = userController.login(loginRequest);

        assertEquals(403, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("verify your email"));
    }

    @Test
    void testLogin_InvalidEmailFormat() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "invalid-email");
        loginRequest.put("password", "password123");

        ResponseEntity<String> response = userController.login(loginRequest);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid email format.", response.getBody());
    }

    @Test
    void testLogin_UserNotFound() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "notfound@example.com");
        loginRequest.put("password", "password123");

        when(userService.getUserByEmail("notfound@example.com")).thenReturn(null);

        ResponseEntity<String> response = userController.login(loginRequest);

        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    void testGetUser_Found() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.getUserByEmail("test@example.com")).thenReturn(user);

        ResponseEntity<?> response = userController.getUser("test@example.com");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(user, response.getBody());
    }

    @Test
    void testGetUser_NotFound() {
        when(userService.getUserByEmail("test@example.com")).thenReturn(null);

        ResponseEntity<?> response = userController.getUser("test@example.com");

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testUpdateBackgroundChoice_Success() {
        when(userService.updateUserBackground("test@example.com", "Background1")).thenReturn(true);

        ResponseEntity<String> response = userController.updateBackgroundChoice("test@example.com", "Background1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Background updated successfully", response.getBody());
    }

    @Test
    void testUpdateBackgroundChoice_NotFound() {
        when(userService.updateUserBackground("test@example.com", "Background1")).thenReturn(false);

        ResponseEntity<String> response = userController.updateBackgroundChoice("test@example.com", "Background1");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testVerifyUser_Success() {
        Map<String, String> verifyRequest = new HashMap<>();
        verifyRequest.put("email", "test@example.com");
        verifyRequest.put("code", "123456");

        when(userService.verifyUser("test@example.com", "123456")).thenReturn(true);

        ResponseEntity<String> response = userController.verifyUser(verifyRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("verified successfully"));
    }

    @Test
    void testVerifyUser_Failure() {
        Map<String, String> verifyRequest = new HashMap<>();
        verifyRequest.put("email", "test@example.com");
        verifyRequest.put("code", "wrongcode");

        when(userService.verifyUser("test@example.com", "wrongcode")).thenReturn(false);

        ResponseEntity<String> response = userController.verifyUser(verifyRequest);

        assertEquals(400, response.getStatusCodeValue());
    }
}
