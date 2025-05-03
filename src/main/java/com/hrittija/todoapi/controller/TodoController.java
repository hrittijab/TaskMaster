package com.hrittija.todoapi.controller;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.service.TodoService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<String> createTodo(@RequestBody Todo todo) {
        todoService.createTodo(todo);
        return ResponseEntity.ok("Todo created");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodo(@PathVariable("id") String taskID) {
        Todo todo = todoService.getTodo(taskID);
        if (todo != null) {
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> updateTodo(@PathVariable("id") String taskID, @RequestBody Todo todo) {
        boolean updated = todoService.updateTodo(taskID, todo);
        if (updated) {
            return ResponseEntity.ok("Todo updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(@PathVariable("id") String taskID) {
        boolean deleted = todoService.deleteTodo(taskID);
        if (deleted) {
            return ResponseEntity.ok("Todo deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
