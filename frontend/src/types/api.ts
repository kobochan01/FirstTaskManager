export interface ApiResponse<T> {
  status: 'ok';
  data: T;
}

export interface Board {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardResponse {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  id: number;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  cards: CardResponse[];
}

export interface BoardDetailResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  lists: TaskListResponse[];
}
