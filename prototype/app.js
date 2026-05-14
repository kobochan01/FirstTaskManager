// ---- データ ----
let boards = [
  { id: 1, name: '仕事' },
  { id: 2, name: 'プライベート' },
];

let lists = [
  { id: 1, boardId: 1, name: 'Todo' },
  { id: 2, boardId: 1, name: 'In Progress' },
  { id: 3, boardId: 1, name: 'Done' },
];

let cards = [
  { id: 1, listId: 1, order: 0, title: 'タスクA', desc: '', due: '', labels: [{ name: '緊急', color: 'red' }], done: false },
  { id: 2, listId: 1, order: 1, title: 'タスクB', desc: '', due: '2025-05-20', labels: [], done: false },
  { id: 3, listId: 2, order: 0, title: 'タスクC', desc: '', due: '', labels: [{ name: '確認待ち', color: 'blue' }], done: false },
  { id: 4, listId: 3, order: 0, title: 'タスクE', desc: '', due: '', labels: [], done: false },
];

let nextBoardId = 3;
let nextListId = 4;
let nextCardId = 5;
let currentBoardId = null;
let editingCardId = null;
let confirmCallback = null;
let dragCardId = null;

// ---- 画面切り替え ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ---- ボード一覧画面 ----
function renderBoardList() {
  const grid = document.getElementById('board-grid');
  grid.innerHTML = '';
  boards.forEach(board => {
    const card = document.createElement('div');
    card.className = 'board-card';
    card.dataset.boardId = board.id;
    card.innerHTML = `
      <div class="board-card-name" data-name-id="${board.id}">${escHtml(board.name)}</div>
      <div class="board-card-actions">
        <button class="btn-card-action btn-edit" data-edit-board="${board.id}">編集</button>
        <button class="btn-card-action btn-delete" data-delete-board="${board.id}">削除</button>
      </div>`;

    card.addEventListener('click', e => {
      if (e.target.closest('[data-edit-board]') || e.target.closest('[data-delete-board]')) return;
      if (e.target.closest('.board-card-name-input')) return;
      openBoard(board.id);
    });

    card.querySelector('[data-edit-board]').addEventListener('click', e => {
      e.stopPropagation();
      startEditBoardName(board.id, card);
    });

    card.querySelector('[data-delete-board]').addEventListener('click', e => {
      e.stopPropagation();
      showConfirm(`「${board.name}」を削除しますか？`, () => {
        boards = boards.filter(b => b.id !== board.id);
        renderBoardList();
      });
    });

    grid.appendChild(card);
  });
}

function startEditBoardName(boardId, card) {
  const nameEl = card.querySelector(`[data-name-id="${boardId}"]`);
  const board = boards.find(b => b.id === boardId);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'board-card-name-input';
  input.value = board.name;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const val = input.value.trim();
    if (val) board.name = val;
    renderBoardList();
  };
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finish();
    if (e.key === 'Escape') renderBoardList();
  });
}

function openBoard(boardId) {
  currentBoardId = boardId;
  const board = boards.find(b => b.id === boardId);
  document.getElementById('board-detail-title').textContent = board.name + 'ボード';
  renderBoardDetail();
  showScreen('screen-board-detail');
}

// ---- ボード詳細画面 ----
function renderBoardDetail() {
  const container = document.getElementById('list-container');
  container.innerHTML = '';
  const boardLists = lists.filter(l => l.boardId === currentBoardId);
  boardLists.forEach(list => {
    container.appendChild(createListElement(list));
  });
}

function createListElement(list) {
  const listEl = document.createElement('div');
  listEl.className = 'list';
  listEl.dataset.listId = list.id;

  const listCards = cards.filter(c => c.listId === list.id).sort((a, b) => a.order - b.order);

  listEl.innerHTML = `
    <div class="list-header">
      <span class="list-title" data-list-title="${list.id}">${escHtml(list.name)}</span>
      <div class="list-header-actions">
        <button class="btn-list-action btn-edit" data-edit-list="${list.id}">編集</button>
        <button class="btn-list-action btn-delete" data-delete-list="${list.id}">削除</button>
      </div>
    </div>
    <div class="list-cards" data-cards-list="${list.id}"></div>
    <div class="add-card-area" data-add-card-area="${list.id}">
      <button class="btn-add-card" data-add-card-btn="${list.id}">+ カードを追加</button>
      <div class="add-card-form hidden" data-add-card-form="${list.id}">
        <textarea class="add-card-textarea" rows="2" placeholder="カードのタイトルを入力..."></textarea>
        <div class="add-card-form-actions">
          <button class="btn btn-primary btn-sm">追加</button>
          <button class="btn btn-secondary btn-sm">キャンセル</button>
        </div>
      </div>
    </div>`;

  // カード描画
  const cardsContainer = listEl.querySelector(`[data-cards-list="${list.id}"]`);
  listCards.forEach(card => {
    cardsContainer.appendChild(createCardElement(card));
  });

  // リスト編集
  listEl.querySelector(`[data-edit-list]`).addEventListener('click', () => {
    startEditListName(list.id, listEl);
  });

  // リスト削除
  listEl.querySelector(`[data-delete-list]`).addEventListener('click', () => {
    showConfirm(`「${list.name}」を削除しますか？`, () => {
      lists = lists.filter(l => l.id !== list.id);
      cards = cards.filter(c => c.listId !== list.id);
      renderBoardDetail();
    });
  });

  // カード追加ボタン
  const addBtn = listEl.querySelector(`[data-add-card-btn]`);
  const addForm = listEl.querySelector(`[data-add-card-form]`);
  const textarea = addForm.querySelector('textarea');
  const [addConfirm, addCancel] = addForm.querySelectorAll('button');

  addBtn.addEventListener('click', () => {
    addBtn.classList.add('hidden');
    addForm.classList.remove('hidden');
    textarea.focus();
  });
  addConfirm.addEventListener('click', () => {
    const title = textarea.value.trim();
    if (!title) return;
    const maxOrder = cards.filter(c => c.listId === list.id).reduce((m, c) => Math.max(m, c.order), -1);
    const newCard = { id: nextCardId++, listId: list.id, order: maxOrder + 1, title, desc: '', due: '', labels: [], done: false };
    cards.push(newCard);
    cardsContainer.appendChild(createCardElement(newCard));
    textarea.value = '';
    addForm.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });
  addCancel.addEventListener('click', () => {
    textarea.value = '';
    addForm.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  // ドロップゾーン
  cardsContainer.addEventListener('dragover', e => {
    e.preventDefault();
    cardsContainer.classList.add('drag-over');
    const afterEl = getDragAfterElement(cardsContainer, e.clientY);
    const placeholder = document.querySelector('.drag-placeholder');
    if (placeholder) {
      if (afterEl) {
        cardsContainer.insertBefore(placeholder, afterEl);
      } else {
        cardsContainer.appendChild(placeholder);
      }
    }
  });
  cardsContainer.addEventListener('dragleave', e => {
    // 子要素へのカーソル移動では発火しないようにする
    if (!cardsContainer.contains(e.relatedTarget)) {
      cardsContainer.classList.remove('drag-over');
    }
  });
  cardsContainer.addEventListener('drop', e => {
    e.preventDefault();
    cardsContainer.classList.remove('drag-over');
    const placeholder = document.querySelector('.drag-placeholder');
    if (dragCardId == null) { placeholder?.remove(); return; }

    const card = cards.find(c => c.id === dragCardId);
    if (!card) { placeholder?.remove(); return; }

    // プレースホルダーの位置に dragging カードを挿入してからDOM順で order を付け直す
    const dragEl = document.querySelector(`[data-card-id="${dragCardId}"]`);
    dragEl.style.display = '';
    if (placeholder) {
      cardsContainer.insertBefore(dragEl, placeholder);
      placeholder.remove();
    } else {
      cardsContainer.appendChild(dragEl);
    }

    // DOM 上の順序を cards データに反映
    const cardEls = [...cardsContainer.querySelectorAll('.card')];
    cardEls.forEach((el, i) => {
      const id = Number(el.dataset.cardId);
      const c = cards.find(c => c.id === id);
      if (c) { c.listId = list.id; c.order = i; }
    });
  });

  return listEl;
}

function startEditListName(listId, listEl) {
  const titleEl = listEl.querySelector(`[data-list-title="${listId}"]`);
  const list = lists.find(l => l.id === listId);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'list-title-input';
  input.value = list.name;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const val = input.value.trim();
    if (val) list.name = val;
    renderBoardDetail();
  };
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finish();
    if (e.key === 'Escape') renderBoardDetail();
  });
}

function findDoneList(boardId) {
  return lists.find(l => l.boardId === boardId && /done|完了/i.test(l.name));
}

function createCardElement(card) {
  const el = document.createElement('div');
  el.className = 'card' + (card.done ? ' card-done' : '');
  el.draggable = true;
  el.dataset.cardId = card.id;

  let metaHtml = '';
  if (card.labels.length > 0) {
    metaHtml += card.labels.map(l =>
      `<span class="card-label ${l.color}">${l.name}</span>`
    ).join('');
  }
  if (card.due) {
    metaHtml += `<span class="card-due">期限: ${formatDate(card.due)}</span>`;
  }

  el.innerHTML = `
    <div class="card-top">
      <input type="checkbox" class="card-checkbox" ${card.done ? 'checked' : ''}>
      <div class="card-title ${card.done ? 'card-title-done' : ''}">${escHtml(card.title)}</div>
    </div>
    ${metaHtml ? `<div class="card-meta">${metaHtml}</div>` : ''}`;

  const checkbox = el.querySelector('.card-checkbox');
  checkbox.addEventListener('click', e => {
    e.stopPropagation();
    card.done = checkbox.checked;
    if (card.done) {
      const doneList = findDoneList(currentBoardId);
      if (doneList && card.listId !== doneList.id) {
        card.listId = doneList.id;
        const maxOrder = cards.filter(c => c.listId === doneList.id).reduce((m, c) => Math.max(m, c.order), -1);
        card.order = maxOrder + 1;
      }
    }
    renderBoardDetail();
  });

  el.addEventListener('click', e => {
    if (e.target.classList.contains('card-checkbox')) return;
    openCardModal(card.id);
  });

  el.addEventListener('dragstart', () => {
    dragCardId = card.id;
    el.classList.add('dragging');
    setTimeout(() => {
      const ph = document.createElement('div');
      ph.className = 'drag-placeholder';
      el.parentNode && el.parentNode.insertBefore(ph, el.nextSibling);
      el.style.display = 'none';
    }, 0);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
    el.style.display = '';
    dragCardId = null;
    // drop が発火しなかった場合（リスト外にドロップ）のクリーンアップ
    document.querySelector('.drag-placeholder')?.remove();
    document.querySelectorAll('.drag-over').forEach(e => e.classList.remove('drag-over'));
  });

  return el;
}

function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll('.card:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ---- カード詳細モーダル ----
function openCardModal(cardId) {
  editingCardId = cardId;
  const card = cards.find(c => c.id === cardId);

  document.getElementById('modal-card-title-display').textContent = card.title;
  document.getElementById('modal-title-input').value = card.title;
  document.getElementById('modal-desc-input').value = card.desc;
  document.getElementById('modal-due-input').value = card.due;

  renderModalLabels(card.labels);
  document.getElementById('label-picker').classList.add('hidden');

  document.getElementById('modal-title-input').addEventListener('input', updateSaveBtn);
  updateSaveBtn();

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function renderModalLabels(labels) {
  const list = document.getElementById('modal-label-list');
  list.innerHTML = '';
  labels.forEach((label, i) => {
    const tag = document.createElement('span');
    tag.className = `label-tag ${label.color}`;
    tag.innerHTML = `${escHtml(label.name)}<button class="label-tag-remove" data-remove-label="${i}">×</button>`;
    tag.querySelector('[data-remove-label]').addEventListener('click', () => {
      const card = cards.find(c => c.id === editingCardId);
      card.labels.splice(i, 1);
      renderModalLabels(card.labels);
    });
    list.appendChild(tag);
  });
}

function updateSaveBtn() {
  const val = document.getElementById('modal-title-input').value.trim();
  document.getElementById('btn-modal-save').disabled = !val;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  editingCardId = null;
}

// ---- 確認ダイアログ ----
function showConfirm(message, onOk) {
  document.getElementById('confirm-message').textContent = message;
  confirmCallback = onOk;
  document.getElementById('confirm-overlay').classList.remove('hidden');
}

// ---- ユーティリティ ----
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}`;
}

// ---- イベント登録 ----
document.addEventListener('DOMContentLoaded', () => {

  // 新規ボード
  document.getElementById('btn-new-board').addEventListener('click', () => {
    document.getElementById('new-board-form').classList.remove('hidden');
    document.getElementById('new-board-input').focus();
  });
  document.getElementById('btn-new-board-save').addEventListener('click', () => {
    const val = document.getElementById('new-board-input').value.trim();
    if (!val) return;
    boards.push({ id: nextBoardId++, name: val });
    document.getElementById('new-board-input').value = '';
    document.getElementById('new-board-form').classList.add('hidden');
    renderBoardList();
  });
  document.getElementById('btn-new-board-cancel').addEventListener('click', () => {
    document.getElementById('new-board-input').value = '';
    document.getElementById('new-board-form').classList.add('hidden');
  });
  document.getElementById('new-board-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-new-board-save').click();
    if (e.key === 'Escape') document.getElementById('btn-new-board-cancel').click();
  });

  // 戻るボタン
  document.getElementById('btn-back').addEventListener('click', () => {
    currentBoardId = null;
    renderBoardList();
    showScreen('screen-board-list');
  });

  // リスト追加
  document.getElementById('btn-add-list').addEventListener('click', () => {
    document.getElementById('btn-add-list').classList.add('hidden');
    document.getElementById('new-list-form').classList.remove('hidden');
    document.getElementById('new-list-input').focus();
  });
  document.getElementById('btn-new-list-save').addEventListener('click', () => {
    const val = document.getElementById('new-list-input').value.trim();
    if (!val) return;
    lists.push({ id: nextListId++, boardId: currentBoardId, name: val });
    document.getElementById('new-list-input').value = '';
    document.getElementById('new-list-form').classList.add('hidden');
    document.getElementById('btn-add-list').classList.remove('hidden');
    renderBoardDetail();
  });
  document.getElementById('btn-new-list-cancel').addEventListener('click', () => {
    document.getElementById('new-list-input').value = '';
    document.getElementById('new-list-form').classList.add('hidden');
    document.getElementById('btn-add-list').classList.remove('hidden');
  });
  document.getElementById('new-list-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-new-list-save').click();
    if (e.key === 'Escape') document.getElementById('btn-new-list-cancel').click();
  });

  // モーダル：閉じる / キャンセル
  document.getElementById('btn-modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // モーダル：削除
  document.getElementById('btn-modal-delete').addEventListener('click', () => {
    const card = cards.find(c => c.id === editingCardId);
    showConfirm(`「${card.title}」を削除しますか？`, () => {
      cards = cards.filter(c => c.id !== editingCardId);
      closeModal();
      renderBoardDetail();
    });
  });

  // モーダル：保存
  document.getElementById('btn-modal-save').addEventListener('click', () => {
    const card = cards.find(c => c.id === editingCardId);
    card.title = document.getElementById('modal-title-input').value.trim();
    card.desc = document.getElementById('modal-desc-input').value;
    card.due = document.getElementById('modal-due-input').value;
    closeModal();
    renderBoardDetail();
  });

  // ラベル追加
  document.getElementById('btn-add-label').addEventListener('click', () => {
    document.getElementById('label-picker').classList.toggle('hidden');
  });
  document.querySelectorAll('.label-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = cards.find(c => c.id === editingCardId);
      const labelName = btn.dataset.label;
      const labelColor = btn.dataset.color;
      if (!card.labels.find(l => l.name === labelName)) {
        card.labels.push({ name: labelName, color: labelColor });
        renderModalLabels(card.labels);
      }
      document.getElementById('label-picker').classList.add('hidden');
    });
  });

  // 確認ダイアログ
  document.getElementById('btn-confirm-ok').addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
  });
  document.getElementById('btn-confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.add('hidden');
    confirmCallback = null;
  });

  // 初期描画
  renderBoardList();
});
