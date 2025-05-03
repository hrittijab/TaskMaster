package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.User;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName = "Users";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public boolean registerUser(User user) {
        // Check if email already exists
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(user.getEmail()).build());

        GetItemRequest getRequest = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse getResponse = dynamoDbClient.getItem(getRequest);

        if (getResponse.hasItem()) {
            // Email already exists
            return false;
        }

        // Save new user (hash the password first!)
        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("email", AttributeValue.builder().s(user.getEmail()).build());
        item.put("firstName", AttributeValue.builder().s(user.getFirstName()).build());
        item.put("lastName", AttributeValue.builder().s(user.getLastName()).build());
        item.put("passwordHash", AttributeValue.builder().s(hashedPassword).build());

        PutItemRequest putRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(putRequest);
        return true;
    };
    public boolean loginUser(String email, String password) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(email).build());
    
        GetItemRequest getRequest = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();
    
        GetItemResponse getResponse = dynamoDbClient.getItem(getRequest);
    
        if (!getResponse.hasItem()) {
            System.out.println("User not found for email: " + email);
            return false;
        }
    
        String storedPasswordHash = getResponse.item().get("passwordHash").s();
        System.out.println("Stored password hash for " + email + ": " + storedPasswordHash);
        System.out.println("Incoming password: " + password);
    
        boolean matches = passwordEncoder.matches(password, storedPasswordHash);
        System.out.println("Password match result: " + matches);
        
        return matches;
    }
    
    
}