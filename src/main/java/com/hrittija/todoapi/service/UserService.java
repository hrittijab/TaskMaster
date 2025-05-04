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
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(user.getEmail()).build());

        GetItemRequest getRequest = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse getResponse = dynamoDbClient.getItem(getRequest);

        if (getResponse.hasItem()) {
            return false; // email already exists
        }

        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("email", AttributeValue.builder().s(user.getEmail()).build());
        item.put("firstName", AttributeValue.builder().s(user.getFirstName()).build());
        item.put("lastName", AttributeValue.builder().s(user.getLastName()).build());
        item.put("passwordHash", AttributeValue.builder().s(hashedPassword).build());
        item.put("backgroundChoice", AttributeValue.builder().s("default.jpg").build()); // ⭐ default background

        PutItemRequest putRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(putRequest);
        return true;
    }

    public boolean loginUser(String email, String password) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(email).build());

        GetItemRequest getRequest = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse getResponse = dynamoDbClient.getItem(getRequest);

        if (!getResponse.hasItem()) {
            return false;
        }

        String storedPasswordHash = getResponse.item().get("passwordHash").s();
        return passwordEncoder.matches(password, storedPasswordHash);
    }

    public User getUserByEmail(String email) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(email).build());

        GetItemRequest request = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);

        if (response.hasItem()) {
            Map<String, AttributeValue> item = response.item();
            return new User(
                item.get("email").s(),
                item.get("firstName").s(),
                item.get("lastName").s(),
                item.get("passwordHash").s(),
                item.getOrDefault("backgroundChoice", AttributeValue.builder().s("default.jpg").build()).s() // ⭐ safe load
            );
        } else {
            return null;
        }
    }

    // ⭐⭐ NEW: Update User Background
    public boolean updateUserBackground(String email, String backgroundChoice) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("email", AttributeValue.builder().s(email).build());
    
        Map<String, AttributeValueUpdate> updates = new HashMap<>();
        updates.put("backgroundChoice", AttributeValueUpdate.builder()
                .value(AttributeValue.builder().s(backgroundChoice.replace("\"", "")).build()) // ⭐ fixed
                .action(AttributeAction.PUT)
                .build());
    
        UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .attributeUpdates(updates)
                .build();
    
        try {
            dynamoDbClient.updateItem(request);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
}
