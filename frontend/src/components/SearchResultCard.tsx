import type { CardResponse } from '../types/api';

interface Props {
  card: CardResponse;
  keyword: string;
}

function highlight(text: string, keyword: string) {
  if (!keyword) return <>{text}</>;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? <mark key={i}>{part}</mark> : part
      )}
    </>
  );
}

export default function SearchResultCard({ card, keyword }: Props) {
  const formattedDue = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString('ja-JP')
    : null;

  return (
    <div className="search-result-card">
      <div className="card-title">{highlight(card.title, keyword)}</div>
      {card.description && (
        <div className="search-result-desc">
          {highlight(card.description, keyword)}
        </div>
      )}
      <div className="card-meta">
        {formattedDue && <span className="card-due">期限: {formattedDue}</span>}
      </div>
    </div>
  );
}
