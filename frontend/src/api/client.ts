import type {
  ApiResponse,
  Board,
  BoardDetailResponse,
  CardResponse,
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
