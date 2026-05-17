import { useState, useEffect } from 'react';
import type { CardResponse, TaskListResponse } from '../types/api';
import { updateCard, moveCard, deleteCard } from '../api/client';

interface Props {
  card: CardResponse;
  lists: TaskListResponse[];
  onSave: (updated: CardResponse) => void;
  onMove: (cardId: number, fromListId: number, toListId: number, updated: CardResponse) => void;
  onDelete: (cardId: number) => void;
  onClose: () => void;
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function toIsoString(datetimeLocal: string): string {
  if (!datetimeLocal) return '';
  return datetimeLocal + ':00';
}

export default function CardDetailModal({ card, lists, onSave, onMove, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [dueDate, setDueDate] = useState(toDatetimeLocal(card.dueDate));
  const [selectedListId, setSelectedListId] = useState(card.listId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function handleDelete() {
    if (!window.confirm('このカードを削除しますか？')) return;
    setSaving(true);
    try {
      await deleteCard(card.id);
      onDelete(card.id);
      onClose();
    } catch {
      setError('削除に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('タイトルは必須です');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const titleChanged = title.trim() !== card.title;
      const descChanged = (description || null) !== card.description;
      const dueDateChanged = toIsoString(dueDate) !== (card.dueDate ?? '');
      const listChanged = selectedListId !== card.listId;

      let current = card;

      if (titleChanged || descChanged || dueDateChanged) {
        current = await updateCard(
          card.id,
          title.trim(),
          description || undefined,
          dueDate ? toIsoString(dueDate) : undefined,
        );
        onSave(current);
      }

      if (listChanged) {
        current = await moveCard(card.id, selectedListId);
        onMove(card.id, card.listId, selectedListId, current);
      }

      onClose();
    } catch {
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setSaving(false);
    }
  }

  const currentListName = lists.find((l) => l.id === card.listId)?.name ?? '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">カードの詳細</span>
          <button className="modal-close-btn" onClick={onClose} aria-label="閉じる">×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">タイトル</label>
            <input
              className="add-card-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">説明</label>
            <textarea
              className="add-card-input modal-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={saving}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">期限日時</label>
            <input
              className="add-card-input"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">リスト（現在: {currentListName}）</label>
            <select
              className="add-card-input"
              value={selectedListId}
              onChange={(e) => setSelectedListId(Number(e.target.value))}
              disabled={saving}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>{list.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={saving}>
            削除
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
