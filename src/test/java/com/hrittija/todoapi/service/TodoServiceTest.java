package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TodoServiceTest {

    private TodoRepository todoRepository;
    private TodoService todoService;

    @BeforeEach
    void setUp() {
        todoRepository = mock(TodoRepository.class);
        todoService = new TodoService(todoRepository);
    }

    @Test
    void testCreateTodo_Success() {
        Todo todo = new Todo();
        todo.setTaskDescription("Test task");
        todo.setUserEmail("test@example.com");

        Todo result = todoService.createTodo(todo);

        assertNotNull(result.getTaskId());
        assertFalse(result.isCompleted());
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void testCreateTodo_InvalidInput_ShouldThrowException() {
        Todo todo = new Todo();
        todo.setUserEmail("test@example.com");

        assertThrows(IllegalArgumentException.class, () -> todoService.createTodo(todo));
    }

    @Test
    void testGetTodo_Found() {
        Todo todo = new Todo();
        todo.setTaskId("123");

        when(todoRepository.findById("123")).thenReturn(todo);

        Todo result = todoService.getTodo("123");

        assertNotNull(result);
        assertEquals("123", result.getTaskId());
    }

    @Test
    void testGetTodo_NotFound() {
        when(todoRepository.findById("notfound")).thenReturn(null);

        Todo result = todoService.getTodo("notfound");

        assertNull(result);
    }

    @Test
    void testGetAllTodos() {
        Todo todo = new Todo();
        todo.setTaskDescription("Task 1");

        when(todoRepository.findByUserEmail("test@example.com"))
                .thenReturn(Collections.singletonList(todo));

        List<Todo> todos = todoService.getAllTodos("test@example.com");

        assertEquals(1, todos.size());
        assertEquals("Task 1", todos.get(0).getTaskDescription());
    }

    @Test
    void testUpdateTodo_Success() {
        Todo existing = new Todo();
        existing.setTaskId("123");
        existing.setTaskDescription("Old task");

        Todo updated = new Todo();
        updated.setTaskDescription("Updated task");
        updated.setCompleted(true);

        when(todoRepository.findById("123")).thenReturn(existing);

        boolean result = todoService.updateTodo("123", updated);

        assertTrue(result);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void testUpdateTodo_NotFound() {
        when(todoRepository.findById("notfound")).thenReturn(null);

        Todo updated = new Todo();
        updated.setTaskDescription("Updated task");

        boolean result = todoService.updateTodo("notfound", updated);

        assertFalse(result);
    }

    @Test
    void testDeleteTodo_Success() {
        Todo existing = new Todo();
        existing.setTaskId("123");

        when(todoRepository.findById("123")).thenReturn(existing);

        boolean result = todoService.deleteTodo("123");

        assertTrue(result);
        verify(todoRepository, times(1)).delete("123");
    }

    @Test
    void testDeleteTodo_NotFound() {
        when(todoRepository.findById("notfound")).thenReturn(null);

        boolean result = todoService.deleteTodo("notfound");

        assertFalse(result);
    }

    @Test
    void testMarkTodoCompleted_Success() {
        Todo todo = new Todo();
        todo.setTaskId("123");
        todo.setCompleted(false);

        when(todoRepository.findById("123")).thenReturn(todo);

        boolean result = todoService.markTodoCompleted("123", true);

        assertTrue(result);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void testMarkTodoCompleted_NotFound() {
        when(todoRepository.findById("notfound")).thenReturn(null);

        boolean result = todoService.markTodoCompleted("notfound", true);

        assertFalse(result);
    }
}
