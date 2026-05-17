import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoards, createBoard, deleteBoard, updateBoard } from '../api/client';
import type { Board } from '../types/api';

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

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
      window.dispatchEvent(new Event('boards-updated'));
    } catch {
      setError('ボードの削除に失敗しました');
    }
  }

  async function handleSaveBoardName(boardId: number) {
    const trimmed = editingName.trim();
    setEditingBoardId(null);
    if (!trimmed) return;
    try {
      const updated = await updateBoard(boardId, trimmed);
      setBoards((prev) => prev.map((b) => b.id === boardId ? updated : b));
    } catch {
      setError('ボード名の更新に失敗しました');
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
      window.dispatchEvent(new Event('boards-updated'));
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
              {editingBoardId === board.id ? (
                <div className="board-card">
                  <input
                    className="inline-edit-input"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveBoardName(board.id);
                      if (e.key === 'Escape') setEditingBoardId(null);
                    }}
                    onBlur={() => handleSaveBoardName(board.id)}
                    autoFocus
                  />
                </div>
              ) : (
                <Link to={`/boards/${board.id}`} className="board-card">
                  <span className="board-card-name">{board.name}</span>
                </Link>
              )}
              <div className="board-card-actions">
                <button
                  className="board-edit-btn"
                  onClick={(e) => { e.preventDefault(); setEditingBoardId(board.id); setEditingName(board.name); }}
                  aria-label="ボード名を編集"
                >✏</button>
                <button
                  className="board-delete-btn"
                  onClick={() => handleDeleteBoard(board.id)}
                  aria-label="ボードを削除"
                >×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
