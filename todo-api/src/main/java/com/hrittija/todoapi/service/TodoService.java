package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.Todo;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
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
}

