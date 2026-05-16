import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardDetail } from '../api/client';
import type { BoardDetailResponse } from '../types/api';
import KanbanBoard from '../components/KanbanBoard';

export default function BoardDetailPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) return;
    setLoading(true);
    setError(null);
    fetchBoardDetail(Number(boardId))
      .then(setBoard)
      .catch(() => setError('ボードの読み込みに失敗しました'))
      .finally(() => setLoading(false));
  }, [boardId]);

  return (
    <>
      <div className="board-header-bar">
        <button className="btn-back" onClick={() => navigate('/')}>← 戻る</button>
        {board && <span className="board-header-name">{board.name}</span>}
      </div>

      {loading && <p className="status-message" style={{ padding: '20px 24px' }}>読み込み中...</p>}
      {error && <p className="error-message" style={{ padding: '20px 24px' }}>{error}</p>}
      {board && <KanbanBoard lists={board.lists} />}
    </>
  );
}
