package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TodoControllerTest {

    private TodoService todoService;
    private TodoController todoController;

    @BeforeEach
    void setUp() {
        todoService = Mockito.mock(TodoService.class);
        todoController = new TodoController(todoService);
    }

    @Test
    void testCreateTodo() {
        Todo todo = new Todo();
        ResponseEntity<String> response = todoController.createTodo(todo);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo created successfully", response.getBody());
        verify(todoService, times(1)).createTodo(todo);
    }

    @Test
    void testGetTodosByUserEmail_WithTodos() {
        List<Todo> todos = new ArrayList<>();
        todos.add(new Todo());
        when(todoService.getAllTodos("test@example.com")).thenReturn(todos);

        ResponseEntity<?> response = todoController.getTodosByUserEmail("test@example.com");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(todos, response.getBody());
    }

    @Test
    void testGetTodosByUserEmail_NoTodos() {
        when(todoService.getAllTodos("test@example.com")).thenReturn(new ArrayList<>());

        ResponseEntity<?> response = todoController.getTodosByUserEmail("test@example.com");

        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void testGetTodoById_Found() {
        Todo todo = new Todo();
        when(todoService.getTodo("123")).thenReturn(todo);

        ResponseEntity<?> response = todoController.getTodoById("123");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(todo, response.getBody());
    }

    @Test
    void testGetTodoById_NotFound() {
        when(todoService.getTodo("123")).thenReturn(null);

        ResponseEntity<?> response = todoController.getTodoById("123");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testUpdateTodo_Success() {
        when(todoService.updateTodo(eq("123"), any(Todo.class))).thenReturn(true);

        ResponseEntity<String> response = todoController.updateTodo("123", new Todo());

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo updated successfully", response.getBody());
    }

    @Test
    void testUpdateTodo_NotFound() {
        when(todoService.updateTodo(eq("123"), any(Todo.class))).thenReturn(false);

        ResponseEntity<String> response = todoController.updateTodo("123", new Todo());

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testUpdateTodoNotes_Found() {
        Todo existingTodo = new Todo();
        when(todoService.getTodo("123")).thenReturn(existingTodo);
        when(todoService.updateTodo(eq("123"), any(Todo.class))).thenReturn(true);

        ResponseEntity<String> response = todoController.updateTodoNotes("123", "Updated notes");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo notes updated successfully", response.getBody());
    }

    @Test
    void testUpdateTodoNotes_NotFound() {
        when(todoService.getTodo("123")).thenReturn(null);

        ResponseEntity<String> response = todoController.updateTodoNotes("123", "Some notes");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testMarkTodoCompleted_Success() {
        when(todoService.markTodoCompleted("123", true)).thenReturn(true);

        ResponseEntity<String> response = todoController.markTodoCompleted("123", true);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo completion status updated successfully", response.getBody());
    }

    @Test
    void testMarkTodoCompleted_NotFound() {
        when(todoService.markTodoCompleted("123", true)).thenReturn(false);

        ResponseEntity<String> response = todoController.markTodoCompleted("123", true);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteTodo_Success() {
        when(todoService.deleteTodo("123")).thenReturn(true);

        ResponseEntity<String> response = todoController.deleteTodo("123");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Todo deleted successfully", response.getBody());
    }

    @Test
    void testDeleteTodo_NotFound() {
        when(todoService.deleteTodo("123")).thenReturn(false);

        ResponseEntity<String> response = todoController.deleteTodo("123");

        assertEquals(404, response.getStatusCodeValue());
    }
}
