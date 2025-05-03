package com.hrittija.todoapi.repository;

import com.hrittija.todoapi.model.Todo;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.DeleteItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class TodoRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName = "TodoTable"; // <-- your actual table name

    // Attribute names as constants
    private static final String TASK_ID = "taskID";
    private static final String TASK_DESCRIPTION = "taskDescription";
    private static final String COMPLETED = "completed";
    private static final String USER_EMAIL = "userEmail";

    public TodoRepository(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public void save(Todo todo) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put(TASK_ID, AttributeValue.builder().s(todo.getTaskId()).build());
        item.put(TASK_DESCRIPTION, AttributeValue.builder().s(todo.getTaskDescription()).build());
        item.put(COMPLETED, AttributeValue.builder().bool(todo.isCompleted()).build());
        item.put(USER_EMAIL, AttributeValue.builder().s(todo.getUserEmail()).build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
    }

    public Todo findById(String taskId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(TASK_ID, AttributeValue.builder().s(taskId).build());

        GetItemRequest request = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        Map<String, AttributeValue> item = dynamoDbClient.getItem(request).item();

        if (item == null || item.isEmpty()) {
            return null;
        }

        return mapToTodo(item);
    }

    public List<Todo> findByUserEmail(String userEmail) {
        Map<String, AttributeValue> expressionValues = new HashMap<>();
        expressionValues.put(":emailVal", AttributeValue.builder().s(userEmail).build());

        QueryRequest queryRequest = QueryRequest.builder()
                .tableName(tableName)
                .indexName("UserEmailIndex") // <-- use your GSI name if needed
                .keyConditionExpression(USER_EMAIL + " = :emailVal")
                .expressionAttributeValues(expressionValues)
                .build();

        QueryResponse response = dynamoDbClient.query(queryRequest);

        return response.items()
                .stream()
                .map(this::mapToTodo)
                .collect(Collectors.toList());
    }

    public void delete(String taskId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(TASK_ID, AttributeValue.builder().s(taskId).build());

        DeleteItemRequest request = DeleteItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        dynamoDbClient.deleteItem(request);
    }

    private Todo mapToTodo(Map<String, AttributeValue> item) {
        Todo todo = new Todo();
        todo.setTaskId(item.get(TASK_ID).s());
        todo.setTaskDescription(item.get(TASK_DESCRIPTION).s());
        todo.setCompleted(item.get(COMPLETED).bool());
        todo.setUserEmail(item.get(USER_EMAIL).s());
        return todo;
    }
}
