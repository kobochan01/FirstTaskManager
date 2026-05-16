package com.example.taskmanager.config;

import com.example.taskmanager.entity.Board;
import com.example.taskmanager.entity.Card;
import com.example.taskmanager.entity.TaskList;
import com.example.taskmanager.repository.BoardRepository;
import com.example.taskmanager.repository.CardRepository;
import com.example.taskmanager.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final BoardRepository boardRepository;
    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (boardRepository.count() > 0) {
            return;
        }
        seedData();
    }

    private void seedData() {
        Board devBoard = createBoard("開発タスク");
        Board memoBoard = createBoard("個人メモ");

        TaskList devTodo = createList(devBoard, "ToDo", 1);
        TaskList devInProgress = createList(devBoard, "進行中", 2);
        TaskList devDone = createList(devBoard, "完了", 3);

        TaskList memoTodo = createList(memoBoard, "やること", 1);
        TaskList memoInProgress = createList(memoBoard, "進行中", 2);
        TaskList memoDone = createList(memoBoard, "済み", 3);

        createCard(devTodo, "ログイン画面のバグ修正", "ログインボタンを押すと503エラーが出る", 1, LocalDateTime.now().plusDays(3));
        createCard(devTodo, "ユーザー登録APIの実装", "POST /api/users エンドポイントを追加する", 2, LocalDateTime.now().plusDays(5));
        createCard(devTodo, "テストコードの追加", "CardController のユニットテストを作成する", 3, LocalDateTime.now().plusDays(7));

        createCard(devInProgress, "タスク読み取りAPIの実装", "GET /api/cards のエンドポイントを実装中", 1, LocalDateTime.now().plusDays(1));
        createCard(devInProgress, "Docker環境の整備", "docker-compose に Redis を追加する", 2, LocalDateTime.now().plusDays(2));
        createCard(devInProgress, "フロントエンドの雛形作成", "React + TypeScript のプロジェクトを初期化する", 3, LocalDateTime.now().plusDays(4));

        createCard(devDone, "Spring Boot 初期セットアップ", "プロジェクトの雛形を作成した", 1, null);
        createCard(devDone, "PostgreSQL 接続確認", "docker-compose でDB起動しJPA接続を確認した", 2, null);
        createCard(devDone, "ヘルスチェックAPI", "GET /api/health を実装した", 3, null);

        createCard(memoTodo, "技術書を読む", "Clean Architecture を読み進める", 1, LocalDateTime.now().plusDays(10));
        createCard(memoTodo, "英語学習", "毎日30分のリスニング練習", 2, null);
        createCard(memoTodo, "運動習慣をつける", "週3回のジョギング", 3, null);

        createCard(memoInProgress, "AWS学習", "EC2とRDSの使い方を勉強中", 1, LocalDateTime.now().plusDays(14));
        createCard(memoInProgress, "ポートフォリオ作成", "このタスクマネージャーをポートフォリオとして完成させる", 2, LocalDateTime.now().plusDays(30));
        createCard(memoInProgress, "Kotlin学習", "Spring Boot + Kotlin の書き方を調べる", 3, null);

        createCard(memoDone, "Javaの基礎復習", "StreamAPIとLambdaを復習した", 1, null);
        createCard(memoDone, "GitHubアカウント整備", "プロフィールとリポジトリを整理した", 2, null);
        createCard(memoDone, "開発環境セットアップ", "WSL2 + Docker Desktopの環境を構築した", 3, null);
    }

    private Board createBoard(String name) {
        Board board = new Board();
        board.setName(name);
        return boardRepository.save(board);
    }

    private TaskList createList(Board board, String name, int position) {
        TaskList list = new TaskList();
        list.setBoard(board);
        list.setName(name);
        list.setPosition(position);
        return taskListRepository.save(list);
    }

    private void createCard(TaskList list, String title, String description, int position, LocalDateTime dueDate) {
        Card card = new Card();
        card.setTaskList(list);
        card.setTitle(title);
        card.setDescription(description);
        card.setPosition(position);
        card.setDueDate(dueDate);
        cardRepository.save(card);
    }
}
