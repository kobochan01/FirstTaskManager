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
}

export default function KanbanBoard({ boardId, lists, onCardCreated, onListCreated, onCardClick, onCardDropped }: Props) {
  const sorted = [...lists].sort((a, b) => a.position - b.position);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="board-main">
      {sorted.map((list) => (
        <KanbanList key={list.id} list={list} onCardCreated={onCardCreated} onCardClick={onCardClick} onCardDropped={onCardDropped} />
      ))}

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
