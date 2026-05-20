import { render, screen } from '@testing-library/react';
import SearchResultCard from '../components/SearchResultCard';
import type { CardResponse } from '../types/api';

const baseCard: CardResponse = {
  id: 1,
  title: 'Test card',
  description: null,
  dueDate: null,
  listId: 10,
  position: 1,
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
};

describe('SearchResultCard', () => {
  it('タイトルにキーワードがハイライトされる', () => {
    render(<SearchResultCard card={{ ...baseCard, title: 'Hello World' }} keyword="world" />);
    const mark = screen.getByText('World');
    expect(mark.tagName).toBe('MARK');
  });

  it('正規表現の特殊文字を含む検索語でクラッシュしない', () => {
    expect(() => {
      render(<SearchResultCard card={{ ...baseCard, title: 'price: (100)' }} keyword="(" />);
    }).not.toThrow();
  });

  it('キーワードが空のときハイライトなしでテキストを表示する', () => {
    render(<SearchResultCard card={{ ...baseCard, title: 'Hello' }} keyword="" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).toBeNull();
  });
});
