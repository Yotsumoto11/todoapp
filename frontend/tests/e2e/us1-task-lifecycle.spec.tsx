import { describe, expect, it } from 'vitest';

import {
  changeInputValue,
  changeSelectValue,
  click,
  getButton,
  getInput,
  getSelect,
  getTextarea,
  installTaskApiMock,
  renderTaskListPage,
  waitFor
} from './testUtils.js';

describe('US1 タスクライフサイクル', () => {
  it('タスクを作成、編集、削除できる', async () => {
    installTaskApiMock([]);
    const container = await renderTaskListPage();

    await changeInputValue(getInput(container, 'task-title'), '買い物');
    await changeInputValue(getTextarea(container, 'task-description'), '牛乳を買う');
    await changeInputValue(getInput(container, 'task-due-date'), '2026-03-12');
    await changeSelectValue(getSelect(container, 'task-priority'), 'high');
    await click(getButton(container, 'タスクを作成'));

    await waitFor(() => {
      expect(container.textContent).toContain('買い物');
      expect(container.textContent).toContain('優先度: 高');
      expect(container.textContent).toContain('期限: 2026-03-12');
    });

    await click(getButton(container, '編集'));

    const editForm = container.querySelector('form[aria-label^="タスク編集:"]');
    if (!(editForm instanceof HTMLFormElement)) {
      throw new Error('編集フォームが見つかりません。');
    }

    await changeInputValue(editForm.querySelector('input[name="title"]') as HTMLInputElement, '買い物メモ');
    await changeInputValue(editForm.querySelector('textarea[name="description"]') as HTMLTextAreaElement, '牛乳と卵を買う');
    await changeInputValue(editForm.querySelector('input[name="dueDate"]') as HTMLInputElement, '2026-03-15');
    await changeSelectValue(editForm.querySelector('select[name="priority"]') as HTMLSelectElement, 'low');
    await click(getButton(container, '保存'));

    await waitFor(() => {
      expect(container.textContent).toContain('買い物メモ');
      expect(container.textContent).toContain('牛乳と卵を買う');
      expect(container.textContent).toContain('優先度: 低');
      expect(container.textContent).toContain('期限: 2026-03-15');
    });

    await click(getButton(container, '削除'));
    await click(getButton(container, '削除する'));

    await waitFor(() => {
      expect(container.textContent).toContain('条件に一致するタスクはありません。');
    });
  });
});
