import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchBoards } from '../api/client';
import type { Board } from '../types/api';
import SearchBar from './SearchBar';

export default function Sidebar() {
  const [boards, setBoards] = useState<Board[]>([]);
  const location = useLocation();

  const loadBoards = useCallback(() => {
    fetchBoards().then(setBoards).catch(() => {});
  }, []);

  useEffect(() => {
    loadBoards();
    window.addEventListener('boards-updated', loadBoards);
    return () => window.removeEventListener('boards-updated', loadBoards);
  }, [loadBoards]);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" className="sidebar-title">
          <span className="sidebar-title-icon">⬡</span>
          TaskManager
        </Link>
      </div>

      <div className="sidebar-search">
        <SearchBar />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">BOARDS</div>
        <ul className="sidebar-board-list">
          {boards.map((board) => (
            <li key={board.id}>
              <Link
                to={`/boards/${board.id}`}
                className={`sidebar-board-link${location.pathname === `/boards/${board.id}` ? ' active' : ''}`}
              >
                <span className="sidebar-board-dot" />
                <span className="sidebar-board-name">{board.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/" className="sidebar-add-board-btn">
          + 新規ボード
        </Link>
      </nav>
    </aside>
  );
}
