import type { CardResponse } from '../types/api';

interface Props {
  card: CardResponse;
  onCardClick: (card: CardResponse) => void;
}

export default function TaskCard({ card, onCardClick }: Props) {
  const formattedDue = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('ja-JP')
    : null;

  return (
    <div className="card" onClick={() => onCardClick(card)} style={{ cursor: 'pointer' }}>
      <div className="card-title">{card.title}</div>
      <div className="card-meta">
        {formattedDue && <span className="card-due">期限: {formattedDue}</span>}
      </div>
    </div>
  );
}
