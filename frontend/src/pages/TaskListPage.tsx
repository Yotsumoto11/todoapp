import { useCallback, useEffect, useMemo, useState } from 'react';

import { TaskForm, type TaskFormValues } from '../components/TaskForm.js';
import { TaskFilters, type TaskFilterValues } from '../components/TaskFilters.js';
import { TaskList } from '../components/TaskList.js';
import { createTask, deleteTask, listTasks, updateTask } from '../services/taskApi.js';
import type { Task, TaskListQuery } from '../services/taskTypes.js';

const TASK_UI_STYLES = `
.task-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  color: #1f2933;
  background:
    radial-gradient(circle at top left, rgba(19, 111, 99, 0.12), transparent 30%),
    linear-gradient(180deg, #fbf7f0 0%, #f4efe7 100%);
}

.task-page .page-header {
  margin-bottom: 24px;
}

.task-page .page-header h1 {
  margin: 0 0 8px;
  line-height: 1;
  font-size: clamp(2rem, 3.2vw, 2.8rem);
}

.task-page .page-header p {
  margin: 0;
  color: #667085;
}

.task-page .screen-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(320px, 1fr);
  gap: 20px;
  align-items: start;
}

.task-page .screen-card {
  background: #fffdf8;
  border: 1px solid rgba(216, 207, 194, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 18px 45px rgba(37, 32, 26, 0.08);
}

.task-page .screen-header {
  margin-bottom: 14px;
}

.task-page .screen-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.task-page .screen-description {
  margin: 8px 0 0;
  color: #667085;
  line-height: 1.6;
  font-size: 0.92rem;
}

.task-page .toolbar {
  margin-bottom: 14px;
}

.task-page .toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.task-page .toolbar-group label {
  min-width: 140px;
}

.task-page .summary-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  color: #667085;
  font-size: 0.92rem;
}

.task-page .summary-row p {
  margin: 0;
}

.task-page .task-list-error {
  margin: 0 0 14px;
  color: #b42318;
  font-weight: 600;
}

.task-page ul[aria-label='タスク一覧'] {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.task-page ul[aria-label='タスク一覧'] > li {
  margin: 0;
}

.task-page .task-row {
  display: block;
  padding: 14px;
  border: 1px solid #d8cfc2;
  border-radius: 16px;
  background: #fff;
}

.task-page .task-main {
  display: grid;
  gap: 10px;
}

.task-page .task-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.task-page .task-header-row h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.task-page .task-complete-button {
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ece6da;
  color: #1f2933;
  white-space: nowrap;
}

.task-page .task-description {
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.task-page .task-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.task-page .task-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.task-page .task-due-date {
  margin: 0;
  font-weight: 700;
  font-size: 0.92rem;
  color: #475467;
  white-space: nowrap;
}

.task-page .task-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.task-page .task-actions button,
.task-page .form-actions button {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  background: #ece6da;
  color: #1f2933;
}

.task-page .task-actions .danger-button {
  background: #b42318;
  color: #fff;
}

.task-page .task-actions .primary-button,
.task-page .form-actions .primary-button {
  background: #136f63;
  color: #fff;
}

.task-page .form-card {
  display: grid;
  gap: 12px;
}

.task-page .form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.task-page .form-card label {
  display: grid;
  gap: 6px;
}

.task-page .form-card label span {
  font-size: 0.9rem;
  font-weight: 700;
}

.task-page input,
.task-page textarea,
.task-page select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d8cfc2;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  font: inherit;
}

.task-page textarea {
  resize: vertical;
}

.task-page .form-grid select,
.task-page .form-grid .compact-priority-select {
  height: 32px;
  font-size: 13px;
  padding: 4px 8px;
}

.task-page .form-grid input[type='date'],
.task-page .form-grid .compact-date-input {
  height: 32px;
  font-size: 13px;
  padding: 4px 8px;
}

.task-page .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.task-page .status-badge,
.task-page .priority-badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.task-page .status-overdue {
  background: #fde2e2;
  color: #b42318;
}

.task-page .status-dueSoon {
  background: #fff4cc;
  color: #b54708;
}

.task-page .status-upcoming {
  background: #e7efff;
  color: #1849a9;
}

.task-page .status-none {
  background: #f2f4f7;
  color: #475467;
}

.task-page .task-status-todo {
  background: #eff8ff;
  color: #175cd3;
}

.task-page .task-status-done {
  background: #ecfdf3;
  color: #027a48;
}

.task-page .priority-high {
  background-color: #fde2e2;
  color: #b42318;
}

.task-page .priority-medium {
  background-color: #fff4cc;
  color: #b54708;
}

.task-page .priority-low {
  background-color: #e7f6ec;
  color: #067647;
}

.task-page .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 980px) {
  .task-page .screen-grid {
    grid-template-columns: 1fr;
  }

  .task-page .form-grid {
    grid-template-columns: 1fr;
  }

  .task-page .task-row {
    display: block;
  }
}
`;

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterValues>({
    status: 'all',
    dueWindow: 'all',
    sort: 'newest'
  });

  const taskQuery = useMemo<TaskListQuery>(
    () => {
      const query: TaskListQuery = {
        page: 1,
        pageSize: 50
      };

      if (filters.status === 'active') {
        query.status = 'todo';
      }

      if (filters.status === 'completed') {
        query.status = 'done';
      }

      if (filters.dueWindow !== 'all') {
        query.dueWindow = filters.dueWindow;
      }

      if (filters.sort === 'newest') {
        query.sortBy = 'createdAt';
        query.sortOrder = 'desc';
      }

      if (filters.sort === 'oldest') {
        query.sortBy = 'createdAt';
        query.sortOrder = 'asc';
      }

      if (filters.sort === 'dueDateAsc') {
        query.sortBy = 'dueDate';
        query.sortOrder = 'asc';
      }

      if (filters.sort === 'dueDateDesc') {
        query.sortBy = 'dueDate';
        query.sortOrder = 'desc';
      }

      if (filters.sort === 'priorityAsc') {
        query.sortBy = 'priority';
        query.sortOrder = 'asc';
      }

      if (filters.sort === 'priorityDesc') {
        query.sortBy = 'priority';
        query.sortOrder = 'desc';
      }

      return query;
    },
    [filters.dueWindow, filters.sort, filters.status]
  );

  const loadTasks = useCallback(async (query: TaskListQuery) => {
    setLoading(true);
    try {
      const response = await listTasks(query);
      setTasks(response.items);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'タスク一覧の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks(taskQuery);
  }, [loadTasks, taskQuery]);

  async function handleCreateTask(values: TaskFormValues) {
    setSubmitting(true);
    try {
      await createTask({
        title: values.title,
        ...(values.description ? { description: values.description } : {}),
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        priority: values.priority
      });
      await loadTasks(taskQuery);
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'タスクの作成に失敗しました。');
      throw createError;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdits(
    taskId: string,
    values: { title: string; description: string; dueDate: string; priority: 'low' | 'medium' | 'high' }
  ) {
    try {
      await updateTask(taskId, {
        title: values.title,
        description: values.description ? values.description : null,
        dueDate: values.dueDate ? values.dueDate : null,
        priority: values.priority
      });
      await loadTasks(taskQuery);
      setError(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'タスクの更新に失敗しました。');
      throw updateError;
    }
  }

  async function handleToggleStatus(task: Task) {
    try {
      await updateTask(task.id, {
        status: task.status === 'done' ? 'todo' : 'done'
      });
      await loadTasks(taskQuery);
      setError(null);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'タスク状態の更新に失敗しました。');
      throw toggleError;
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
      await loadTasks(taskQuery);
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'タスクの削除に失敗しました。');
      throw deleteError;
    }
  }

  return (
    <main className="task-page">
      <style>{TASK_UI_STYLES}</style>
      <header className="page-header">
        <h1>TODO 管理</h1>
        <p>タスクの作成、絞り込み、並び替え、編集を1画面で確認できます。</p>
      </header>

      <div className="screen-grid">
        <section className="screen-card" aria-labelledby="task-list-heading">
          <header className="screen-header">
            <h2 id="task-list-heading">タスク一覧</h2>
            <p className="screen-description">一覧、絞り込み、並び替え、期限状態を確認できます。</p>
          </header>

          <div className="toolbar">
            <TaskFilters values={filters} onChange={setFilters} />
          </div>

          <div className="summary-row">
            <p aria-live="polite">{loading ? '絞り込み結果を読み込み中…' : `${tasks.length}件のタスクを表示中`}</p>
          </div>

          {loading ? <p>タスクを読み込み中…</p> : null}
          {!loading && tasks.length === 0 ? <p>条件に一致するタスクはありません。</p> : null}
          {!loading && tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              sortBy={taskQuery.sortBy ?? 'createdAt'}
              sortOrder={taskQuery.sortOrder ?? 'desc'}
              onSaveEdits={handleSaveEdits}
              onToggleStatus={handleToggleStatus}
              onDeleteTask={handleDeleteTask}
            />
          ) : null}
        </section>

        <section className="screen-card" aria-labelledby="create-task-heading">
          <header className="screen-header">
            <h2 id="create-task-heading">タスクを作成</h2>
            <p className="screen-description">新規タスクを登録します。</p>
          </header>
          <TaskForm onSubmit={handleCreateTask} submitting={submitting} />
        </section>
      </div>

      {error ? (
        <p className="task-list-error" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}
    </main>
  );
}
