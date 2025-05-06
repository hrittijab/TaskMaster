package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    private DynamoDbClient dynamoDbClient;
    private UserService userService;

    @BeforeEach
    void setUp() {
        dynamoDbClient = mock(DynamoDbClient.class); // ✅ Mock the DynamoDB client
        userService = new UserService(dynamoDbClient);
    }

    @Test
    void testRegisterUser_Success() {
        User user = new User("test@example.com", "Test", "User", "password123", "default.jpg", false, "123456");

        // Mock DynamoDB behavior
        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().build()); // No item found (user doesn't exist yet)

        when(dynamoDbClient.putItem(any(PutItemRequest.class)))
                .thenReturn(PutItemResponse.builder().build()); // Pretend successful insert

        boolean result = userService.registerUser(user);

        assertTrue(result);
    }

    @Test
    void testLoginUser_Success() {
        String rawPassword = "password123";
        User user = new User("test@example.com", "Test", "User", rawPassword, "default.jpg", true, "123456");

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("email", AttributeValue.builder().s(user.getEmail()).build());
        item.put("passwordHash", AttributeValue.builder().s(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(rawPassword)).build());

        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().item(item).build());

        boolean result = userService.loginUser(user.getEmail(), rawPassword);

        assertTrue(result);
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        User user = new User("existing@example.com", "Existing", "User", "password123", "default.jpg", false, "654321");

        // Simulate DynamoDB returning a user (already exists)
        Map<String, AttributeValue> existingUser = new HashMap<>();
        existingUser.put("email", AttributeValue.builder().s(user.getEmail()).build());
        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().item(existingUser).build());

        boolean result = userService.registerUser(user);

        assertFalse(result); 
    }

    @Test
    void testVerifyUser_Success() {
        String email = "verify@example.com";
        String code = "123456";

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("email", AttributeValue.builder().s(email).build());
        item.put("verificationCode", AttributeValue.builder().s(code).build());

        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().item(item).build());

        when(dynamoDbClient.updateItem(any(UpdateItemRequest.class)))
                .thenReturn(UpdateItemResponse.builder().build());

        boolean result = userService.verifyUser(email, code);

        assertTrue(result);
    }

    @Test
    void testUpdateUserBackground_Success() {
        String email = "background@example.com";
        String backgroundChoice = "sunset.jpg";

        when(dynamoDbClient.updateItem(any(UpdateItemRequest.class)))
                .thenReturn(UpdateItemResponse.builder().build());

        boolean result = userService.updateUserBackground(email, backgroundChoice);

        assertTrue(result);
    }



}
