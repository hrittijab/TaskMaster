package com.hrittija.todoapi.controller;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HomeControllerTest {

    @Test
    void testHomeEndpoint() {
        // Arrange
        HomeController controller = new HomeController();

        // Act
        String response = controller.home();

        // Assert
        assertThat(response).isEqualTo("Todo API is running!");
    }
}
