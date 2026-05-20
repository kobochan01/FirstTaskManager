import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(paramQuery);
  const [syncedParam, setSyncedParam] = useState(paramQuery);

  if (syncedParam !== paramQuery) {
    setSyncedParam(paramQuery);
    setQuery(paramQuery);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="カードを検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn-search" type="submit">検索</button>
    </form>
  );
}
