import type {
  ApiResponse,
  Board,
  BoardDetailResponse,
  CardResponse,
  TaskListResponse,
} from '../types/api';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

export function fetchBoards(): Promise<Board[]> {
  return request<Board[]>('/boards');
}

export function fetchBoardDetail(id: number): Promise<BoardDetailResponse> {
  return request<BoardDetailResponse>(`/boards/${id}`);
}

export function createBoard(name: string): Promise<Board> {
  return request<Board>('/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export function searchCards(keyword?: string): Promise<CardResponse[]> {
  const qs = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  return request<CardResponse[]>(`/cards${qs}`);
}

export function createCard(
  listId: number,
  title: string,
  description?: string,
  dueDate?: string,
): Promise<CardResponse> {
  return request<CardResponse>(`/lists/${listId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: description || null, dueDate: dueDate || null }),
  });
}

export function createList(boardId: number, name: string): Promise<TaskListResponse> {
  return request<TaskListResponse>(`/boards/${boardId}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}
