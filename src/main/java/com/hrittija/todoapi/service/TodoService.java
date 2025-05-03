package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.Todo;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TodoService {

    private final DynamoDbClient dynamoDbClient;

    public TodoService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public void createTodo(Todo todo) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("taskID", AttributeValue.builder().s(todo.getTaskID()).build());
        item.put("taskDescription", AttributeValue.builder().s(todo.getTaskDescription()).build());
    
        PutItemRequest request = PutItemRequest.builder()
                .tableName("TodoTable")
                .item(item)
                .build();
    
        dynamoDbClient.putItem(request);
    }
    

    public Todo getTodo(String taskID) {
        Map<String, AttributeValue> key = Map.of("taskID", AttributeValue.builder().s(taskID).build());

        GetItemRequest request = GetItemRequest.builder()
                .tableName("TodoTable")
                .key(key)
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);

        if (response.hasItem()) {
            String description = response.item().get("taskDescription").s();
            return new Todo(taskID, description);
        }
        return null;
    }

    public List<Todo> getAllTodos() {
        List<Todo> todos = new ArrayList<>();

        ScanRequest scanRequest = ScanRequest.builder()
                .tableName("TodoTable")
                .build();

        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);

        for (Map<String, AttributeValue> item : scanResponse.items()) {
            String taskID = item.get("taskID").s();
            String taskDescription = item.get("taskDescription").s();
            todos.add(new Todo(taskID, taskDescription));
        }

        return todos;
    }


    public boolean updateTodo(String taskID, Todo updatedTodo) {
        // Check if item exists first
        Todo existingTodo = getTodo(taskID);
        if (existingTodo == null) {
            return false;
        }
    
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("taskID", AttributeValue.builder().s(taskID).build());
        item.put("taskDescription", AttributeValue.builder().s(updatedTodo.getTaskDescription()).build());
    
        PutItemRequest request = PutItemRequest.builder()
                .tableName("TodoTable")
                .item(item)
                .build();
    
        dynamoDbClient.putItem(request);
        return true;
    }
    
    public boolean deleteTodo(String taskID) {
        // Check if item exists first
        Todo existingTodo = getTodo(taskID);
        if (existingTodo == null) {
            return false;
        }
    
        Map<String, AttributeValue> key = Map.of("taskID", AttributeValue.builder().s(taskID).build());
    
        DeleteItemRequest request = DeleteItemRequest.builder()
                .tableName("TodoTable")
                .key(key)
                .build();
    
        dynamoDbClient.deleteItem(request);
        return true;
    }
    
}

