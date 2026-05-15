package com.example.taskmanager.repository;

import com.example.taskmanager.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    List<TaskList> findByBoardIdOrderByPosition(Long boardId);
}
