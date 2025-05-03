package com.hrittija.todoapi.service;

import com.hrittija.todoapi.model.Todo;
import com.hrittija.todoapi.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public Todo createTodo(Todo todo) {
        if (todo.getTaskDescription() == null || todo.getUserEmail() == null) {
            throw new IllegalArgumentException("TaskDescription and UserEmail cannot be null.");
        }

        String taskId = UUID.randomUUID().toString();
        todo.setTaskId(taskId);
        todo.setCompleted(false);
        todoRepository.save(todo);
        return todo;
    }

    public Todo getTodo(String taskId) {
        return todoRepository.findById(taskId);
    }

    public List<Todo> getAllTodos(String userEmail) {
        return todoRepository.findByUserEmail(userEmail);
    }

    public boolean updateTodo(String taskId, Todo updatedTodo) {
        Todo existing = todoRepository.findById(taskId);
        if (existing != null) {
            updatedTodo.setTaskId(taskId); // Make sure ID stays same
            todoRepository.save(updatedTodo);
            return true;
        }
        return false;
    }

    public boolean deleteTodo(String taskId) {
        Todo existing = todoRepository.findById(taskId);
        if (existing != null) {
            todoRepository.delete(taskId);
            return true;
        }
        return false;
    }

    public boolean markTodoCompleted(String taskId, boolean completed) {
        Todo todo = todoRepository.findById(taskId);
        if (todo != null) {
            todo.setCompleted(completed);
            todoRepository.save(todo);
            return true;
        }
        return false;
    }
}
