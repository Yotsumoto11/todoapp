import { describe, expect, it } from 'vitest';

import { installTaskApiMock, renderTaskListPage, waitFor } from './testUtils.js';

describe('US3 期限表示', () => {
  it('期限状態を日本語で表示できる', async () => {
    installTaskApiMock([
      { title: '期限なしタスク', dueDate: null },
      { title: '期限切れタスク', dueDate: '2026-03-01' },
      { title: '期限が近いタスク', dueDate: '2026-03-10' },
      { title: '期限ありタスク', dueDate: '2026-03-20' }
    ]);

    const container = await renderTaskListPage();

    await waitFor(() => {
      expect(container.textContent).toContain('期限状況:');
      expect(container.textContent).toContain('期限なし');
      expect(container.textContent).toContain('期限切れ');
      expect(container.textContent).toContain('期限が近い');
      expect(container.textContent).toContain('期限あり');
    });
  });
});
