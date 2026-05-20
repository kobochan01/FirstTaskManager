import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Sidebar from '../components/Sidebar';
import * as client from '../api/client';

vi.mock('../api/client');

describe('Sidebar', () => {
  it('fetchBoards失敗時にエラーメッセージを表示する', async () => {
    vi.mocked(client.fetchBoards).mockRejectedValue(new Error('network error'));
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('読み込みに失敗しました')).toBeInTheDocument();
    });
  });

  it('fetchBoards成功時はエラーメッセージを表示しない', async () => {
    vi.mocked(client.fetchBoards).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText('読み込みに失敗しました')).not.toBeInTheDocument();
    });
  });
});
