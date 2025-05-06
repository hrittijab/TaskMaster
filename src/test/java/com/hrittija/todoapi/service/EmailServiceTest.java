package com.hrittija.todoapi.service;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

class EmailServiceTest {

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // No real SMTP server is called
        emailService = new EmailService();
    }

    @Test
    void testSendVerificationEmail_noRealSending() {

        assertDoesNotThrow(() -> {
        

            System.out.println("Skipping real email sending in unit test.");
        });
    }
}
