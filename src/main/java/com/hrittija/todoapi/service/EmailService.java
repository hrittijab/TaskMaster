package com.hrittija.todoapi.service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {

    @Value("${spring.mail.username}") // Your sender Gmail
    private String senderEmail;

    @Value("${spring.mail.password}") // Your Gmail app password
    private String senderPassword;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            // Step 1: SMTP Properties
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            // Step 2: Session
            Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(senderEmail, senderPassword);
                }
            });

            // Step 3: Compose email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(toEmail)
            );
            message.setSubject("Verify your Email for Todo App");

            String htmlContent = "<html><body>"
                    + "<h2>Welcome to Todo App!</h2>"
                    + "<p>Please verify your email by entering this code:</p>"
                    + "<h1>" + verificationCode + "</h1>"
                    + "<p>If you didn't request this, you can ignore this email.</p>"
                    + "</body></html>";

            message.setContent(htmlContent, "text/html; charset=utf-8");

            // Step 4: Send email
            Transport.send(message);

            System.out.println("✅ Email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
