import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import KanbanList from '../components/KanbanList';
import * as client from '../api/client';
import type { TaskListResponse } from '../types/api';

vi.mock('../api/client');

const mockList: TaskListResponse = {
  id: 10,
  name: 'Test List',
  position: 1,
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
  cards: [],
};

const noop = () => {};

describe('KanbanList', () => {
  it('リスト削除失敗時にonErrorを呼ぶ', async () => {
    vi.mocked(client.deleteList).mockRejectedValue(new Error('delete failed'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onError = vi.fn();

    render(
      <KanbanList
        boardId={1}
        list={mockList}
        onCardCreated={noop}
        onCardClick={noop}
        onCardDropped={noop}
        onListDeleted={noop}
        onListRenamed={noop}
        onError={onError}
      />
    );

    await userEvent.click(screen.getByLabelText('リストを削除'));
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('リストの削除に失敗しました');
    });
  });

  it('リスト名変更失敗時にonErrorを呼ぶ', async () => {
    vi.mocked(client.updateList).mockRejectedValue(new Error('update failed'));
    const onError = vi.fn();

    render(
      <KanbanList
        boardId={1}
        list={mockList}
        onCardCreated={noop}
        onCardClick={noop}
        onCardDropped={noop}
        onListDeleted={noop}
        onListRenamed={noop}
        onError={onError}
      />
    );

    await userEvent.click(screen.getByLabelText('リスト名を編集'));
    const input = screen.getByDisplayValue('Test List');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Name');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('リスト名の変更に失敗しました');
    });
  });
});
