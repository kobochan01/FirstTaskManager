import { useState } from 'react';
import type { CardResponse, TaskListResponse } from '../types/api';
import { createCard } from '../api/client';
import TaskCard from './TaskCard';

interface Props {
  list: TaskListResponse;
  onCardCreated: (listId: number, card: CardResponse) => void;
}

export default function KanbanList({ list, onCardCreated }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const card = await createCard(list.id, title.trim());
      onCardCreated(list.id, card);
      setTitle('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle('');
    setShowForm(false);
  }

  return (
    <div className="list">
      <div className="list-header">
        <span className="list-title">{list.name}</span>
      </div>
      <div className="list-cards">
        {list.cards.map((card) => (
          <TaskCard key={card.id} card={card} />
        ))}
      </div>

      {showForm ? (
        <form className="add-card-form" onSubmit={handleSubmit}>
          <input
            className="add-card-input"
            type="text"
            placeholder="カードのタイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="add-card-actions">
            <button className="btn btn-primary btn-sm" type="submit" disabled={saving || !title.trim()}>
              {saving ? '追加中...' : 'カードを追加'}
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={handleCancel}>
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setShowForm(true)}>
          + カードを追加
        </button>
      )}
    </div>
  );
}
