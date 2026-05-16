import type { TaskListResponse } from '../types/api';
import KanbanList from './KanbanList';

interface Props {
  lists: TaskListResponse[];
}

export default function KanbanBoard({ lists }: Props) {
  const sorted = [...lists].sort((a, b) => a.position - b.position);

  return (
    <div className="board-main">
      {sorted.map((list) => (
        <KanbanList key={list.id} list={list} />
      ))}
    </div>
  );
}
