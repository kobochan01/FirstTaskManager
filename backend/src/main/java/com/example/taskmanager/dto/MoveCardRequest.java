package com.example.taskmanager.dto;

import lombok.Data;

@Data
public class MoveCardRequest {
    private Long targetListId;
    private Integer position; // 0-based insertion index in the target list (excluding the moving card); null = append to end
}
