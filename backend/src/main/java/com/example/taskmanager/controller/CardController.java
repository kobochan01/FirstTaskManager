package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ApiResponse;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.dto.CreateCardRequest;
import com.example.taskmanager.entity.Card;
import com.example.taskmanager.entity.TaskList;
import com.example.taskmanager.repository.CardRepository;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CardController {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;

    @GetMapping("/api/cards/{id}")
    public ApiResponse<CardResponse> getCardById(@PathVariable Long id) {
        CardResponse response = cardRepository.findById(id)
                .map(CardResponse::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found: " + id));
        return ApiResponse.ok(response);
    }

    @GetMapping("/api/cards")
    public ApiResponse<List<CardResponse>> searchCards(@RequestParam(required = false) String keyword) {
        List<CardResponse> cards;
        if (keyword != null && !keyword.isBlank()) {
            cards = cardRepository
                    .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword)
                    .stream()
                    .map(CardResponse::new)
                    .toList();
        } else {
            cards = cardRepository.findAll()
                    .stream()
                    .map(CardResponse::new)
                    .toList();
        }
        return ApiResponse.ok(cards);
    }

    @GetMapping("/api/lists/{listId}/cards")
    public ApiResponse<List<CardResponse>> getCardsByList(@PathVariable Long listId) {
        if (!taskListRepository.existsById(listId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found: " + listId);
        }
        List<CardResponse> cards = cardRepository.findByTaskListIdOrderByPosition(listId)
                .stream()
                .map(CardResponse::new)
                .toList();
        return ApiResponse.ok(cards);
    }

    @PostMapping("/api/lists/{listId}/cards")
    public ApiResponse<CardResponse> createCard(
            @PathVariable Long listId,
            @RequestBody CreateCardRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        TaskList taskList = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found: " + listId));

        int nextPosition = cardRepository.findByTaskListIdOrderByPosition(listId).size() + 1;

        Card card = new Card();
        card.setTaskList(taskList);
        card.setTitle(request.getTitle().trim());
        card.setDescription(request.getDescription());
        card.setPosition(nextPosition);
        if (request.getDueDate() != null && !request.getDueDate().isBlank()) {
            card.setDueDate(LocalDateTime.parse(request.getDueDate()));
        }

        Card saved = cardRepository.save(card);
        return ApiResponse.ok(new CardResponse(saved));
    }
}
