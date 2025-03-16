package com.hrittija;

public class Todo {
    private String taskID;
    private String taskDescription;

    // Constructor
    public Todo(String taskID, String taskDescription) {
        this.taskID = taskID;
        this.taskDescription = taskDescription;
    }

    // Getters and setters
    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    // Method to display task details
    public void displayTask() {
        System.out.println("Task ID: " + taskID);
        System.out.println("Task Description: " + taskDescription);
    }
}
