package com.hrittija.todoapi.repository;

import com.hrittija.todoapi.model.Todo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TodoRepositoryTest {

    private DynamoDbClient dynamoDbClient;
    private TodoRepository todoRepository;

    @BeforeEach
    void setUp() {
        dynamoDbClient = mock(DynamoDbClient.class);
        todoRepository = new TodoRepository(dynamoDbClient);
    }

    @Test
    void testSaveTodo() {
        Todo todo = new Todo();
        todo.setTaskId("1");
        todo.setTaskDescription("Test Task");
        todo.setCompleted(false);
        todo.setUserEmail("test@example.com");
        todo.setDueDate("2025-12-31");
        todo.setNotes("Important notes");

        todoRepository.save(todo);

        ArgumentCaptor<PutItemRequest> captor = ArgumentCaptor.forClass(PutItemRequest.class);
        verify(dynamoDbClient).putItem(captor.capture());

        PutItemRequest savedRequest = captor.getValue();
        Map<String, AttributeValue> item = savedRequest.item();

        assertEquals("1", item.get("taskID").s());
        assertEquals("Test Task", item.get("taskDescription").s());
        assertFalse(item.get("completed").bool());
        assertEquals("test@example.com", item.get("userEmail").s());
        assertEquals("2025-12-31", item.get("dueDate").s());
        assertEquals("Important notes", item.get("notes").s());
    }

    @Test
    void testFindById_TodoExists() {
        Map<String, AttributeValue> dbItem = new HashMap<>();
        dbItem.put("taskID", AttributeValue.builder().s("1").build());
        dbItem.put("taskDescription", AttributeValue.builder().s("Test Task").build());
        dbItem.put("completed", AttributeValue.builder().bool(false).build());
        dbItem.put("userEmail", AttributeValue.builder().s("test@example.com").build());

        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().item(dbItem).build());

        Todo todo = todoRepository.findById("1");

        assertNotNull(todo);
        assertEquals("1", todo.getTaskId());
        assertEquals("Test Task", todo.getTaskDescription());
        assertFalse(todo.isCompleted());
        assertEquals("test@example.com", todo.getUserEmail());
    }

    @Test
    void testFindById_TodoDoesNotExist() {
        when(dynamoDbClient.getItem(any(GetItemRequest.class)))
                .thenReturn(GetItemResponse.builder().item(new HashMap<>()).build());

        Todo todo = todoRepository.findById("999");

        assertNull(todo); // no todo should be found
    }

    @Test
    void testDeleteTodo() {
        todoRepository.delete("1");

        ArgumentCaptor<DeleteItemRequest> captor = ArgumentCaptor.forClass(DeleteItemRequest.class);
        verify(dynamoDbClient).deleteItem(captor.capture());

        DeleteItemRequest deleteRequest = captor.getValue();
        assertEquals("1", deleteRequest.key().get("taskID").s());
    }
}
