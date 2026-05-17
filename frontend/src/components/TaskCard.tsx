import { useState } from 'react';
import type { CardResponse } from '../types/api';

interface Props {
  card: CardResponse;
  onCardClick: (card: CardResponse) => void;
}

export default function TaskCard({ card, onCardClick }: Props) {
  const [dragging, setDragging] = useState(false);
  const formattedDue = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('ja-JP')
    : null;

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData('cardId', card.id.toString());
    e.dataTransfer.setData('sourceListId', card.listId.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  return (
    <div
      className={`card${dragging ? ' card-dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onCardClick(card)}
      style={{ cursor: 'grab' }}
    >
      <div className="card-title">{card.title}</div>
      <div className="card-meta">
        {formattedDue && <span className="card-due">期限: {formattedDue}</span>}
      </div>
    </div>
  );
}
