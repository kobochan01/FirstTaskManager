import { useState } from 'react';
import type { CardResponse, TaskListResponse } from '../types/api';
import { createCard, deleteList, updateList } from '../api/client';
import TaskCard from './TaskCard';

interface Props {
  boardId: number;
  list: TaskListResponse;
  onCardCreated: (listId: number, card: CardResponse) => void;
  onCardClick: (card: CardResponse) => void;
  onCardDropped: (cardId: number, fromListId: number, toListId: number, position: number) => void;
  onListDeleted: (listId: number) => void;
  onListRenamed: (listId: number, newName: string) => void;
}

export default function KanbanList({ boardId, list, onCardCreated, onCardClick, onCardDropped, onListDeleted, onListRenamed }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dropIndex, setDropIndex] = useState<number>(list.cards.length);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  async function handleDeleteList() {
    if (!window.confirm('このリストとすべてのカードを削除しますか？')) return;
    try {
      await deleteList(boardId, list.id);
      onListDeleted(list.id);
    } catch {
      // エラー時は何もしない（UIを変化させない）
    }
  }

  async function handleSaveListName() {
    const trimmed = nameDraft.trim();
    setEditingName(false);
    if (!trimmed || trimmed === list.name) return;
    try {
      await updateList(boardId, list.id, trimmed);
      onListRenamed(list.id, trimmed);
    } catch {
      // エラー時は変更しない
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const card = await createCard(list.id, title.trim());
      onCardCreated(list.id, card);
      setTitle('');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTitle('');
    setShowForm(false);
  }

  function computeDropIndex(e: React.DragEvent<HTMLDivElement>): number {
    const listCardsEl = e.currentTarget.querySelector('.list-cards');
    if (!listCardsEl) return list.cards.length;
    const cardEls = Array.from(listCardsEl.querySelectorAll('.card'));
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) return i;
    }
    return cardEls.length;
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.types.includes('listid')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOver) setDragOver(true);
    setDropIndex(computeDropIndex(e));
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.types.includes('listid')) return;
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
      setDropIndex(list.cards.length);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.types.includes('listid')) return;
    e.preventDefault();
    setDragOver(false);
    const cardId = parseInt(e.dataTransfer.getData('cardId'), 10);
    const fromListId = parseInt(e.dataTransfer.getData('sourceListId'), 10);
    if (isNaN(cardId) || isNaN(fromListId)) return;

    let position = computeDropIndex(e);

    // 同一リスト内での並べ替えの場合、移動元のカードを除いた後のインデックスに補正する
    if (fromListId === list.id) {
      const sourceIndex = list.cards.findIndex((c) => c.id === cardId);
      if (sourceIndex !== -1 && sourceIndex < position) {
        position -= 1;
      }
    }

    onCardDropped(cardId, fromListId, list.id, position);
  }

  return (
    <div
      className={`list${dragOver ? ' list-drag-over' : ''}${isDragging ? ' list-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className="list-header"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('listId', list.id.toString());
          e.dataTransfer.effectAllowed = 'move';
          setIsDragging(true);
        }}
        onDragEnd={() => setIsDragging(false)}
      >
        {editingName ? (
          <input
            className="inline-edit-input list-title-input"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveListName();
              if (e.key === 'Escape') setEditingName(false);
            }}
            onBlur={handleSaveListName}
            autoFocus
            draggable={false}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="list-title">{list.name}</span>
        )}
        <div className="list-header-actions">
          <button
            className="list-edit-btn"
            onClick={(e) => { e.stopPropagation(); setNameDraft(list.name); setEditingName(true); }}
            aria-label="リスト名を編集"
          >✏</button>
          <button className="list-delete-btn" onClick={handleDeleteList} aria-label="リストを削除">×</button>
        </div>
      </div>
      <div className="list-cards">
        {dragOver && dropIndex === 0 && <div className="drop-indicator" />}
        {list.cards.map((card, index) => (
          <div key={card.id}>
            <TaskCard card={card} onCardClick={onCardClick} />
            {dragOver && dropIndex === index + 1 && <div className="drop-indicator" />}
          </div>
        ))}
      </div>

      {showForm ? (
        <form className="add-card-form" onSubmit={handleSubmit}>
          <input
            className="add-card-input"
            type="text"
            placeholder="カードのタイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="add-card-actions">
            <button className="btn btn-primary btn-sm" type="submit" disabled={saving || !title.trim()}>
              {saving ? '追加中...' : 'カードを追加'}
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={handleCancel}>
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setShowForm(true)}>
          + カードを追加
        </button>
      )}
    </div>
  );
}
