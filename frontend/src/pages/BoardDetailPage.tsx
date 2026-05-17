import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardDetail } from '../api/client';
import type { BoardDetailResponse, CardResponse, TaskListResponse } from '../types/api';
import KanbanBoard from '../components/KanbanBoard';
import CardDetailModal from '../components/CardDetailModal';

export default function BoardDetailPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardResponse | null>(null);

  useEffect(() => {
    if (!boardId) return;
    setLoading(true);
    setError(null);
    fetchBoardDetail(Number(boardId))
      .then(setBoard)
      .catch(() => setError('ボードの読み込みに失敗しました'))
      .finally(() => setLoading(false));
  }, [boardId]);

  const handleCardCreated = useCallback((listId: number, card: CardResponse) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, cards: [...list.cards, card] } : list,
        ),
      };
    });
  }, []);

  const handleListCreated = useCallback((list: TaskListResponse) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return { ...prev, lists: [...prev.lists, list] };
    });
  }, []);

  const handleCardClick = useCallback((card: CardResponse) => {
    setSelectedCard(card);
  }, []);

  const handleCardSaved = useCallback((updatedCard: CardResponse) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === updatedCard.listId
            ? { ...list, cards: list.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)) }
            : list,
        ),
      };
    });
    setSelectedCard(updatedCard);
  }, []);

  const handleCardMoved = useCallback(
    (cardId: number, fromListId: number, toListId: number, updatedCard: CardResponse) => {
      setBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map((list) => {
            if (list.id === fromListId) {
              return { ...list, cards: list.cards.filter((c) => c.id !== cardId) };
            }
            if (list.id === toListId) {
              return { ...list, cards: [...list.cards, updatedCard] };
            }
            return list;
          }),
        };
      });
      setSelectedCard(updatedCard);
    },
    [],
  );

  const handleModalClose = useCallback(() => {
    setSelectedCard(null);
  }, []);

  return (
    <>
      <div className="board-header-bar">
        <button className="btn-back" onClick={() => navigate('/')}>← 戻る</button>
        {board && <span className="board-header-name">{board.name}</span>}
      </div>

      {loading && <p className="status-message" style={{ padding: '20px 24px' }}>読み込み中...</p>}
      {error && <p className="error-message" style={{ padding: '20px 24px' }}>{error}</p>}
      {board && (
        <KanbanBoard
          boardId={board.id}
          lists={board.lists}
          onCardCreated={handleCardCreated}
          onListCreated={handleListCreated}
          onCardClick={handleCardClick}
        />
      )}

      {selectedCard && board && (
        <CardDetailModal
          card={selectedCard}
          lists={board.lists}
          onSave={handleCardSaved}
          onMove={handleCardMoved}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
