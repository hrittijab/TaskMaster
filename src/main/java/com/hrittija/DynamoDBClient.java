package com.hrittija;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.Map;

public class DynamoDBClient {

    private static DynamoDbClient dynamoDbClient;

    // Singleton Pattern for DynamoDB Client
    public static DynamoDbClient getDynamoDbClient() {
        if (dynamoDbClient == null) {
            dynamoDbClient = DynamoDbClient.builder()
                    .region(Region.US_EAST_1) // Replace with your region
                    .build();
        }
        return dynamoDbClient;
    }
    public void createTable() {
        DynamoDbClient client = getDynamoDbClient();
    
        CreateTableRequest request = CreateTableRequest.builder()
                .tableName("TodoItems")
                .keySchema(KeySchemaElement.builder()
                        .attributeName("taskID")
                        .keyType(KeyType.HASH)  // Partition key
                        .build())
                .attributeDefinitions(AttributeDefinition.builder()
                        .attributeName("taskID")
                        .attributeType(ScalarAttributeType.S)
                        .build())
                .provisionedThroughput(ProvisionedThroughput.builder()
                        .readCapacityUnits(5L)
                        .writeCapacityUnits(5L)
                        .build())
                .build();
    
        client.createTable(request);
        System.out.println("Table 'TodoItems' created successfully!");
    }
    

    // Create a todo item
    public void createTodoItem(String taskID, String taskDescription) {
        DynamoDbClient client = getDynamoDbClient();

        // Define the item structure
        Map<String, AttributeValue> item = Map.of(
                "taskID", AttributeValue.builder().s(taskID).build(),
                "taskDescription", AttributeValue.builder().s(taskDescription).build()
        );

        // Create a PutItem request
        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName("TodoItems")  // Your table name
                .item(item)
                .build();

        // Put item into the DynamoDB table
        client.putItem(putItemRequest);
        System.out.println("Todo item added successfully!");
    }

    // Get a todo item by taskID
    public void getTodoItem(String taskID) {
        DynamoDbClient client = getDynamoDbClient();

        // Create a GetItem request
        GetItemRequest getItemRequest = GetItemRequest.builder()
                .tableName("TodoItems")  // Your table name
                .key(Map.of("taskID", AttributeValue.builder().s(taskID).build()))
                .build();

        // Get item from DynamoDB
        GetItemResponse response = client.getItem(getItemRequest);

        // Check if the item exists and display it
        if (response.hasItem()) {
            String taskDescription = response.item().get("taskDescription").s();
            System.out.println("Task ID: " + taskID);
            System.out.println("Task Description: " + taskDescription);
        } else {
            System.out.println("Todo item with taskID " + taskID + " not found.");
        }
    }
}
