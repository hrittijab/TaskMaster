package com.hrittija;

import java.util.Scanner;

public class TodoApp {

    public void start() {
        Scanner scanner = new Scanner(System.in);
        DynamoDBClient dbClient = new DynamoDBClient();

        System.out.println("Welcome to the To-Do App!");

        while (true) {
            System.out.println("Enter 1 to Add a To-Do item, 2 to View a To-Do item, 0 to Exit:");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline character

            switch (choice) {
                case 1:
                    // Add a task
                    System.out.println("Enter Task ID:");
                    String taskID = scanner.nextLine();
                    System.out.println("Enter Task Description:");
                    String taskDescription = scanner.nextLine();
                    
                    // Create a new Todo object
                    Todo newTodo = new Todo(taskID, taskDescription);
                    
                    // Add to DynamoDB using dbClient
                    dbClient.createTodoItem(newTodo.getTaskID(), newTodo.getTaskDescription());
                    break;
                case 2:
                    // View a task by taskID
                    System.out.println("Enter Task ID to View:");
                    String viewTaskID = scanner.nextLine();
                    dbClient.getTodoItem(viewTaskID);
                    break;
                case 0:
                    // Exit the app
                    System.out.println("Exiting the application.");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid choice. Try again.");
            }
        }
    }
}
