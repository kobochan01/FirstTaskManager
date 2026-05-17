package com.example.taskmanager.dto;

import lombok.Data;

@Data
public class MoveListRequest {
    // 0-based insertion index in the board's list (excluding the moving list)
    private Integer position;
}
