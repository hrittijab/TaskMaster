package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*") // 🔥 IMPORTANT if you are calling from localhost:3000 or localhost:5173 (React)
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // 🚀 Create a new Todo (supports notes, due date, etc.)
    @PostMapping
    public ResponseEntity<String> createTodo(@RequestBody Todo todo) {
        todoService.createTodo(todo);
        return ResponseEntity.ok("Todo created successfully");
    }

    // 🚀 Get all Todos for a specific user
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getTodosByUserEmail(@PathVariable String email) {
        List<Todo> todos = todoService.getAllTodos(email);
        if (todos.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(todos);
    }

    // 🚀 Get a single Todo by its ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable("id") String taskId) {
        Todo todo = todoService.getTodo(taskId);
        if (todo != null) {
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Update an entire Todo (description, notes, due date, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTodo(@PathVariable("id") String taskId, @RequestBody Todo updatedTodo) {
        boolean updated = todoService.updateTodo(taskId, updatedTodo);
        if (updated) {
            return ResponseEntity.ok("Todo updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // (OPTIONAL) 🚀 Update only notes (you don't actually need this separately for now)
    @PutMapping("/{id}/notes")
    public ResponseEntity<String> updateTodoNotes(@PathVariable("id") String taskId, @RequestBody String notes) {
        Todo existingTodo = todoService.getTodo(taskId);
        if (existingTodo != null) {
            existingTodo.setNotes(notes);
            todoService.updateTodo(taskId, existingTodo);
            return ResponseEntity.ok("Todo notes updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Mark a Todo as completed/incomplete
    @PutMapping("/{id}/complete")
    public ResponseEntity<String> markTodoCompleted(@PathVariable("id") String taskId, @RequestBody Boolean completed) {
        boolean success = todoService.markTodoCompleted(taskId, completed);
        if (success) {
            return ResponseEntity.ok("Todo completion status updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🚀 Delete a Todo
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
