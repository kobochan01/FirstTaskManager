package com.example.taskmanager.dto;

import lombok.Data;

@Data
public class UpdateCardRequest {
    private String title;
    private String description;
    private String dueDate;
}
