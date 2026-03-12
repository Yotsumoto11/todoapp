import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  getSelect,
  installTaskApiMock,
  renderTaskListPage,
  waitFor
} from './testUtils.js';

describe('US2 フィルタ', () => {
  it('状態フィルタと期限フィルタでタスクを絞り込める', async () => {
    installTaskApiMock([
      { title: '完了済みで期限なし', status: 'done', dueDate: null },
      { title: '未完了で期限切れ', status: 'todo', dueDate: '2026-03-01' },
      { title: '未完了で本日期限', status: 'todo', dueDate: '2026-03-10' }
    ]);

    const container = await renderTaskListPage();

    await waitFor(() => {
      expect(container.textContent).toContain('完了済みで期限なし');
      expect(container.textContent).toContain('未完了で期限切れ');
      expect(container.textContent).toContain('未完了で本日期限');
    });

    await changeSelectValue(getSelect(container, 'task-filter-status'), 'completed');

    await waitFor(() => {
      expect(container.textContent).toContain('完了済みで期限なし');
      expect(container.textContent).not.toContain('未完了で期限切れ');
    });

    await changeSelectValue(getSelect(container, 'task-filter-due-window'), 'none');

    await waitFor(() => {
      expect(container.textContent).toContain('完了済みで期限なし');
      expect(container.textContent).not.toContain('未完了で本日期限');
    });
  });
});
