package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Card;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CardResponse {

    private final Long id;
    private final String title;
    private final String description;
    private final LocalDateTime dueDate;
    private final Integer position;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public CardResponse(Card card) {
        this.id = card.getId();
        this.title = card.getTitle();
        this.description = card.getDescription();
        this.dueDate = card.getDueDate();
        this.position = card.getPosition();
        this.createdAt = card.getCreatedAt();
        this.updatedAt = card.getUpdatedAt();
    }
}
