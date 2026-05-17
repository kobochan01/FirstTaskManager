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

    // 青いゴースト画像でカーソルと明確に区別できるようにする
    const ghost = document.createElement('div');
    ghost.textContent = card.title;
    ghost.setAttribute('style', [
      'position:absolute', 'top:-9999px', 'left:-9999px',
      'padding:7px 12px', 'background:#0052cc', 'color:#fff',
      'border-radius:6px', 'font-size:13px', 'font-weight:600',
      'max-width:220px', 'white-space:nowrap',
      'overflow:hidden', 'text-overflow:ellipsis',
      'box-shadow:0 4px 12px rgba(0,82,204,0.45)',
      'pointer-events:none',
    ].join(';'));
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 12, 20);
    setTimeout(() => document.body.removeChild(ghost), 0);

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
