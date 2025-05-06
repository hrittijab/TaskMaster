package com.hrittija.todoapi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String email;
    private String firstName;
    private String lastName;
    private String passwordHash; // We'll store hashed password
    private String backgroundChoice;

    private boolean isVerified; // false until email is verified
    private String verificationCode; // 6-digit random code
}
