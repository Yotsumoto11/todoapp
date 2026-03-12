import { describe, expect, it } from 'vitest';

import { installTaskApiMock, renderTaskListPage, waitFor } from './testUtils.js';

function dayOffset(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('US3 期限表示', () => {
  it('期限状態を日本語で表示できる', async () => {
    installTaskApiMock([
      { title: '期限なしタスク', dueDate: null },
      { title: '期限切れタスク', dueDate: dayOffset(-1) },
      { title: '本日期限タスク', dueDate: dayOffset(0) },
      { title: '期限ありタスク', dueDate: dayOffset(1) }
    ]);

    const container = await renderTaskListPage();

    await waitFor(() => {
      expect(container.textContent).toContain('期限状況:');
      expect(container.textContent).toContain('期限なし');
      expect(container.textContent).toContain('期限切れ');
      expect(container.textContent).toContain('本日期限');
      expect(container.textContent).toContain('期限あり');
    });
  });
});
