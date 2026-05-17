import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchCards } from '../api/client';
import type { CardResponse } from '../types/api';
import SearchResultCard from '../components/SearchResultCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('q') ?? '';
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setCards([]);
    setError(null);
    searchCards(keyword || undefined)
      .then(setCards)
      .catch(() => setError('検索に失敗しました'))
      .finally(() => setLoading(false));
  }, [keyword]);

  const pageTitle = keyword
    ? `「${keyword}」の検索結果（${cards.length}件）`
    : `すべてのカード（${cards.length}件）`;

  return (
    <main className="main">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-back" onClick={() => navigate(-1)}>← 戻る</button>
          <h2 className="page-title">{loading ? '検索中...' : pageTitle}</h2>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && cards.length === 0 && (
        <p className="status-message">カードが見つかりませんでした。</p>
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="search-result-grid">
          {cards.map((card) => (
            <SearchResultCard key={card.id} card={card} keyword={keyword} />
          ))}
        </div>
      )}
    </main>
  );
}
