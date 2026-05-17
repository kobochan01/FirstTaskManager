import { useState } from 'react';
import type { CardResponse, TaskListResponse } from '../types/api';
import { createList } from '../api/client';
import KanbanList from './KanbanList';

interface Props {
  boardId: number;
  lists: TaskListResponse[];
  onCardCreated: (listId: number, card: CardResponse) => void;
  onListCreated: (list: TaskListResponse) => void;
  onCardClick: (card: CardResponse) => void;
  onCardDropped: (cardId: number, fromListId: number, toListId: number, position: number) => void;
  onListDeleted: (listId: number) => void;
  onListRenamed: (listId: number, newName: string) => void;
  onListMoved: (listId: number, position: number) => void;
}

export default function KanbanBoard({ boardId, lists, onCardCreated, onListCreated, onCardClick, onCardDropped, onListDeleted, onListRenamed, onListMoved }: Props) {
  const sorted = [...lists].sort((a, b) => a.position - b.position);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [dropListIndex, setDropListIndex] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const list = await createList(boardId, name.trim());
      onListCreated(list);
      setName('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName('');
    setShowForm(false);
  }

  function computeListDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const listEls = e.currentTarget.querySelectorAll('.list');
    for (let i = 0; i < listEls.length; i++) {
      const rect = (listEls[i] as HTMLElement).getBoundingClientRect();
      if (e.clientX < rect.left + rect.width / 2) return i;
    }
    return listEls.length;
  }

  function handleBoardDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer.types.includes('listid')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropListIndex(computeListDropIndex(e));
  }

  function handleBoardDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropListIndex(null);
    }
  }

  function handleBoardDrop(e: React.DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer.types.includes('listid')) return;
    e.preventDefault();
    const listId = parseInt(e.dataTransfer.getData('listId'), 10);
    if (isNaN(listId)) return;
    const dropIdx = computeListDropIndex(e);
    setDropListIndex(null);

    // 自分を除いた配列への挿入インデックスに変換（moveCardと同じ規約）
    const currentIndex = sorted.findIndex((l) => l.id === listId);
    let insertAt = dropIdx;
    if (currentIndex !== -1 && currentIndex < dropIdx) insertAt -= 1;
    onListMoved(listId, insertAt);
  }

  return (
    <div
      className="board-main"
      onDragOver={handleBoardDragOver}
      onDragLeave={handleBoardDragLeave}
      onDrop={handleBoardDrop}
    >
      {sorted.map((list, index) => (
        <>
          {dropListIndex === index && <div key={`indicator-${index}`} className="list-drop-indicator" />}
          <KanbanList
            key={list.id}
            boardId={boardId}
            list={list}
            onCardCreated={onCardCreated}
            onCardClick={onCardClick}
            onCardDropped={onCardDropped}
            onListDeleted={onListDeleted}
            onListRenamed={onListRenamed}
          />
        </>
      ))}
      {dropListIndex === sorted.length && <div className="list-drop-indicator" />}

      <div className="add-list-column">
        {showForm ? (
          <form className="add-list-form" onSubmit={handleSubmit}>
            <input
              className="add-card-input"
              type="text"
              placeholder="リスト名を入力..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="btn btn-primary btn-sm" type="submit" disabled={saving || !name.trim()}>
                {saving ? '追加中...' : 'リストを追加'}
              </button>
              <button className="btn btn-secondary btn-sm" type="button" onClick={handleCancel}>
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <button className="add-list-btn" onClick={() => setShowForm(true)}>
            + リストを追加
          </button>
        )}
      </div>
    </div>
  );
}
