import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards, createBoard, deleteBoard } from '../api/client';
import type { Board } from '../types/api';

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBoards()
      .then(setBoards)
      .catch(() => setError('ボードの読み込みに失敗しました'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteBoard(boardId: number) {
    if (!window.confirm('このボードとすべてのリスト・カードを削除しますか？')) return;
    try {
      await deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch {
      setError('ボードの削除に失敗しました');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newBoardName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const created = await createBoard(name);
      setBoards((prev) => [...prev, created]);
      setNewBoardName('');
      setShowForm(false);
    } catch {
      setError('ボードの作成に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="main">
      <div className="page-header">
        <h2 className="page-title">ボード一覧</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'キャンセル' : '+ 新規ボード'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            className="inline-input"
            type="text"
            placeholder="ボード名を入力..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>
            {saving ? '作成中...' : '作成'}
          </button>
        </form>
      )}

      {loading && <p className="status-message">読み込み中...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="board-grid">
          {boards.map((board) => (
            <div key={board.id} className="board-card-wrapper">
              <Link to={`/boards/${board.id}`} className="board-card">
                <span className="board-card-name">{board.name}</span>
              </Link>
              <button
                className="board-delete-btn"
                onClick={() => handleDeleteBoard(board.id)}
                aria-label="ボードを削除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
