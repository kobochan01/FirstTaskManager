package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ApiResponse;
import com.example.taskmanager.dto.BoardDetailResponse;
import com.example.taskmanager.dto.CardResponse;
import com.example.taskmanager.dto.CreateListRequest;
import com.example.taskmanager.dto.TaskListResponse;
import com.example.taskmanager.entity.Board;
import com.example.taskmanager.entity.TaskList;
import com.example.taskmanager.repository.BoardRepository;
import com.example.taskmanager.repository.CardRepository;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardRepository boardRepository;
    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;

    @GetMapping
    public ApiResponse<List<Board>> getAllBoards() {
        return ApiResponse.ok(boardRepository.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<BoardDetailResponse> getBoardById(@PathVariable Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));
        BoardDetailResponse response = toBoardDetail(board);
        return ApiResponse.ok(response);
    }

    @GetMapping("/{boardId}/lists")
    public ApiResponse<List<TaskListResponse>> getListsByBoard(@PathVariable Long boardId) {
        if (!boardRepository.existsById(boardId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + boardId);
        }
        List<TaskListResponse> lists = taskListRepository.findByBoardIdOrderByPosition(boardId)
                .stream()
                .map(this::toTaskListResponse)
                .toList();
        return ApiResponse.ok(lists);
    }

    @PostMapping
    public ApiResponse<Board> createBoard(@RequestBody Board board) {
        Board saved = boardRepository.save(board);
        return ApiResponse.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ApiResponse<Void> deleteBoard(@PathVariable Long id) {
        if (!boardRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id);
        }
        List<TaskList> lists = taskListRepository.findByBoardIdOrderByPosition(id);
        for (TaskList list : lists) {
            cardRepository.deleteAll(cardRepository.findByTaskListIdOrderByPosition(list.getId()));
        }
        taskListRepository.deleteAll(lists);
        boardRepository.deleteById(id);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{boardId}/lists/{listId}")
    @Transactional
    public ApiResponse<Void> deleteList(@PathVariable Long boardId, @PathVariable Long listId) {
        TaskList list = taskListRepository.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found: " + listId));
        if (!list.getBoard().getId().equals(boardId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "List not found in board");
        }
        cardRepository.deleteAll(cardRepository.findByTaskListIdOrderByPosition(listId));
        taskListRepository.deleteById(listId);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{boardId}/lists")
    public ApiResponse<TaskListResponse> createList(
            @PathVariable Long boardId,
            @RequestBody CreateListRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + boardId));

        int nextPosition = taskListRepository.findByBoardIdOrderByPosition(boardId).size() + 1;

        TaskList taskList = new TaskList();
        taskList.setBoard(board);
        taskList.setName(request.getName().trim());
        taskList.setPosition(nextPosition);

        TaskList saved = taskListRepository.save(taskList);
        return ApiResponse.ok(new TaskListResponse(saved, List.of()));
    }

    private BoardDetailResponse toBoardDetail(Board board) {
        List<TaskListResponse> lists = taskListRepository.findByBoardIdOrderByPosition(board.getId())
                .stream()
                .map(this::toTaskListResponse)
                .toList();
        return new BoardDetailResponse(board, lists);
    }

    private TaskListResponse toTaskListResponse(TaskList taskList) {
        List<CardResponse> cards = cardRepository.findByTaskListIdOrderByPosition(taskList.getId())
                .stream()
                .map(CardResponse::new)
                .toList();
        return new TaskListResponse(taskList, cards);
    }
}
