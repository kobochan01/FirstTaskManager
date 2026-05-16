package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskList;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class TaskListResponse {

    private final Long id;
    private final String name;
    private final Integer position;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final List<CardResponse> cards;

    public TaskListResponse(TaskList taskList, List<CardResponse> cards) {
        this.id = taskList.getId();
        this.name = taskList.getName();
        this.position = taskList.getPosition();
        this.createdAt = taskList.getCreatedAt();
        this.updatedAt = taskList.getUpdatedAt();
        this.cards = cards;
    }
}
