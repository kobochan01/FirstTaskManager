import { useState } from 'react';
import type { CardResponse, TaskListResponse } from '../types/api';
import { createCard } from '../api/client';
import TaskCard from './TaskCard';

interface Props {
  list: TaskListResponse;
  onCardCreated: (listId: number, card: CardResponse) => void;
  onCardClick: (card: CardResponse) => void;
  onCardDropped: (cardId: number, fromListId: number, toListId: number, position: number) => void;
}

export default function KanbanList({ list, onCardCreated, onCardClick, onCardDropped }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dropIndex, setDropIndex] = useState<number>(list.cards.length);

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

  function computeDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const listCardsEl = e.currentTarget.querySelector('.list-cards');
    if (!listCardsEl) return list.cards.length;
    const cardEls = Array.from(listCardsEl.querySelectorAll('.card'));
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) return i;
    }
    return cardEls.length;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOver) setDragOver(true);
    setDropIndex(computeDropIndex(e));
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
      setDropIndex(list.cards.length);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const cardId = parseInt(e.dataTransfer.getData('cardId'), 10);
    const fromListId = parseInt(e.dataTransfer.getData('sourceListId'), 10);
    if (isNaN(cardId) || isNaN(fromListId)) return;

    let position = computeDropIndex(e);

    // 同一リスト内での並べ替えの場合、移動元のカードを除いた後のインデックスに補正する
    if (fromListId === list.id) {
      const sourceIndex = list.cards.findIndex((c) => c.id === cardId);
      if (sourceIndex !== -1 && sourceIndex < position) {
        position -= 1;
      }
    }

    onCardDropped(cardId, fromListId, list.id, position);
  }

  return (
    <div
      className={`list${dragOver ? ' list-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <span className="list-title">{list.name}</span>
      </div>
      <div className="list-cards">
        {dragOver && dropIndex === 0 && <div className="drop-indicator" />}
        {list.cards.map((card, index) => (
          <div key={card.id}>
            <TaskCard card={card} onCardClick={onCardClick} />
            {dragOver && dropIndex === index + 1 && <div className="drop-indicator" />}
          </div>
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
