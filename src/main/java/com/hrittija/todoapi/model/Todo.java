package com.hrittija.todoapi.model;

public class Todo {
    private String taskId;
    private String taskDescription;
    private boolean completed;
    private String userEmail;
    private String dueDate; // ✅ Already existing
    private String notes;   // ✅ NEW FIELD

    // Constructors
    public Todo() {}

    public Todo(String taskId, String taskDescription, boolean completed, String userEmail, String dueDate, String notes) {
        this.taskId = taskId;
        this.taskDescription = taskDescription;
        this.completed = completed;
        this.userEmail = userEmail;
        this.dueDate = dueDate;
        this.notes = notes;
    }

    // Getters and Setters

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getNotes() { // ✅ NEW
        return notes;
    }

    public void setNotes(String notes) { // ✅ NEW
        this.notes = notes;
    }
}
