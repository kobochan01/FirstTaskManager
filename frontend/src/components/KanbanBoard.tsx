import type { CardResponse, TaskListResponse } from '../types/api';
import KanbanList from './KanbanList';

interface Props {
  lists: TaskListResponse[];
  onCardCreated: (listId: number, card: CardResponse) => void;
}

export default function KanbanBoard({ lists, onCardCreated }: Props) {
  const sorted = [...lists].sort((a, b) => a.position - b.position);

  return (
    <div className="board-main">
      {sorted.map((list) => (
        <KanbanList key={list.id} list={list} onCardCreated={onCardCreated} />
      ))}
    </div>
  );
}
