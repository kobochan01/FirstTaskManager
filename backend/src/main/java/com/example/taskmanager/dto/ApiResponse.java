package com.example.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private String status;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>("ok", data);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>("ok", null);
    }
}
