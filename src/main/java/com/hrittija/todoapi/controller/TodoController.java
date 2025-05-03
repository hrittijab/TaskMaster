package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // 🚀 Create a new Todo
    @PostMapping
    public ResponseEntity<String> createTodo(@RequestBody Todo todo) {
        todoService.createTodo(todo);
        return ResponseEntity.ok("Todo created successfully");
    }

    // 🚀 Get todos by user email
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getTodosByUserEmail(@PathVariable String email) {
        List<Todo> todos = todoService.getAllTodos(email);
        if (todos.isEmpty()) {
            return ResponseEntity.noContent().build(); // Better to send 204 No Content than 404
        }
        return ResponseEntity.ok(todos);
    }

    // 🚀 Get a specific todo by task ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable("id") String taskId) {
        Todo todo = todoService.getTodo(taskId);
        if (todo != null) {
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Update a specific todo
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTodo(@PathVariable("id") String taskId, @RequestBody Todo todo) {
        boolean updated = todoService.updateTodo(taskId, todo);
        if (updated) {
            return ResponseEntity.ok("Todo updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Mark a todo as completed / not completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<String> markTodoCompleted(@PathVariable("id") String taskId, @RequestBody Boolean completed) {
        boolean success = todoService.markTodoCompleted(taskId, completed);
        if (success) {
            return ResponseEntity.ok("Todo completion status updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Delete a specific todo
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(@PathVariable("id") String taskId) {
        boolean deleted = todoService.deleteTodo(taskId);
        if (deleted) {
            return ResponseEntity.ok("Todo deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
