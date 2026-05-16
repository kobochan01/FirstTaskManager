package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Board;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class BoardDetailResponse {

    private final Long id;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<TaskListResponse> lists;

    public BoardDetailResponse(Board board, List<TaskListResponse> lists) {
        this.id = board.getId();
        this.name = board.getName();
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
        this.lists = lists;
    }
}
