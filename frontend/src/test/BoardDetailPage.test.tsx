import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import BoardDetailPage from '../pages/BoardDetailPage';
import * as client from '../api/client';
import type { BoardDetailResponse } from '../types/api';

vi.mock('../api/client');

const mockBoard: BoardDetailResponse = {
  id: 1,
  name: 'Test Board',
  lists: [],
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/boards/1']}>
      <Routes>
        <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('BoardDetailPage', () => {
  it('ボード名保存失敗時にエラーメッセージを表示する', async () => {
    vi.mocked(client.fetchBoardDetail).mockResolvedValue(mockBoard);
    vi.mocked(client.updateBoard).mockRejectedValue(new Error('update failed'));

    renderPage();
    await screen.findByText('Test Board');

    await userEvent.click(screen.getByText('Test Board'));
    const input = screen.getByDisplayValue('Test Board');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Name');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('ボード名の変更に失敗しました')).toBeInTheDocument();
    });
  });
});
