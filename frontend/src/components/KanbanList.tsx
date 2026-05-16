import type { TaskListResponse } from '../types/api';
import TaskCard from './TaskCard';

interface Props {
  list: TaskListResponse;
}

export default function KanbanList({ list }: Props) {
  return (
    <div className="list">
      <div className="list-header">
        <span className="list-title">{list.name}</span>
      </div>
      <div className="list-cards">
        {list.cards.map((card) => (
          <TaskCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
