package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ApiResponse;
import com.example.taskmanager.entity.Board;
import com.example.taskmanager.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardRepository boardRepository;

    // ボード一覧取得
    @GetMapping
    public ApiResponse<List<Board>> getAllBoards() {
        return ApiResponse.ok(boardRepository.findAll());
    }

    // ボード作成
    @PostMapping
    public ApiResponse<Board> createBoard(@RequestBody Board board) {
        Board saved = boardRepository.save(board);
        return ApiResponse.ok(saved);
    }
}
