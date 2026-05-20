import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardDetail, moveCard, updateBoard, moveList } from '../api/client';
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
  const [editingBoardName, setEditingBoardName] = useState(false);
  const [boardNameDraft, setBoardNameDraft] = useState('');
  const [prevBoardId, setPrevBoardId] = useState(boardId);

  if (prevBoardId !== boardId) {
    setPrevBoardId(boardId);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (!boardId) return;
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

  const handleCardDeleted = useCallback((cardId: number) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.filter((c) => c.id !== cardId),
        })),
      };
    });
    setSelectedCard(null);
  }, []);

  const handleListDeleted = useCallback((listId: number) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return { ...prev, lists: prev.lists.filter((l) => l.id !== listId) };
    });
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

  const handleCardDropped = useCallback(async (cardId: number, fromListId: number, toListId: number, position: number) => {
    try {
      const updatedCard = await moveCard(cardId, toListId, position);
      setBoard((prev) => {
        if (!prev) return prev;
        const sameList = fromListId === toListId;
        return {
          ...prev,
          lists: prev.lists.map((list) => {
            if (sameList && list.id === toListId) {
              // 同一リスト内並べ替え: 古い位置から除いて新しい位置に挿入
              const without = list.cards.filter((c) => c.id !== cardId);
              without.splice(position, 0, updatedCard);
              return { ...list, cards: without };
            }
            if (list.id === fromListId) return { ...list, cards: list.cards.filter((c) => c.id !== cardId) };
            if (list.id === toListId) {
              const cards = [...list.cards];
              cards.splice(position, 0, updatedCard);
              return { ...list, cards };
            }
            return list;
          }),
        };
      });
    } catch {
      // API失敗時はUIを変化させない
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedCard(null);
  }, []);

  async function handleSaveBoardName() {
    const trimmed = boardNameDraft.trim();
    setEditingBoardName(false);
    if (!trimmed || trimmed === board!.name) return;
    try {
      const updated = await updateBoard(Number(boardId), trimmed);
      setBoard((prev) => prev ? { ...prev, name: updated.name } : prev);
    } catch {
      // エラー時は変更なし
    }
  }

  const handleListRenamed = useCallback((listId: number, newName: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((l) => l.id === listId ? { ...l, name: newName } : l),
      };
    });
  }, []);

  const handleListMoved = useCallback(async (listId: number, position: number) => {
    if (!board) return;
    try {
      await moveList(board.id, listId, position);
      const refreshed = await fetchBoardDetail(board.id);
      setBoard(refreshed);
    } catch {
      // エラー時は変更なし
    }
  }, [board]);

  return (
    <>
      <div className="board-header-bar">
        <button className="btn-back" onClick={() => navigate('/')}>← 戻る</button>
        {board && (
          editingBoardName ? (
            <input
              className="inline-edit-input board-name-edit-input"
              value={boardNameDraft}
              onChange={(e) => setBoardNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveBoardName();
                if (e.key === 'Escape') setEditingBoardName(false);
              }}
              onBlur={handleSaveBoardName}
              autoFocus
            />
          ) : (
            <span
              className="board-header-name"
              onClick={() => { setBoardNameDraft(board.name); setEditingBoardName(true); }}
              title="クリックして編集"
              style={{ cursor: 'pointer' }}
            >
              {board.name}
            </span>
          )
        )}
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
          onCardDropped={handleCardDropped}
          onListDeleted={handleListDeleted}
          onListRenamed={handleListRenamed}
          onListMoved={handleListMoved}
        />
      )}

      {selectedCard && board && (
        <CardDetailModal
          card={selectedCard}
          lists={board.lists}
          onSave={handleCardSaved}
          onMove={handleCardMoved}
          onDelete={handleCardDeleted}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
