import { useState, type FormEvent, type InvalidEvent, type ReactNode } from 'react';

import type { Task, TaskPriority } from '../services/taskTypes.js';
import { DeleteTaskDialog } from './DeleteTaskDialog.js';

type EditTaskValues = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
};

type TaskItemProps = {
  task: Task;
  onSaveEdits: (taskId: string, values: EditTaskValues) => Promise<void>;
  onToggleStatus: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  dueStatusBadge?: ReactNode;
};

export function TaskItem({ task, onSaveEdits, onToggleStatus, onDeleteTask, dueStatusBadge }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  const statusLabels = {
    todo: '未完了',
    done: '完了'
  } as const;

  const priorityLabels: Record<TaskPriority, string> = {
    low: '低',
    medium: '中',
    high: '高'
  };
  const dueStateLabels = {
    overdue: '期限切れ',
    today: '本日期限',
    upcoming: '期限あり',
    none: '期限なし'
  } as const;
  const priorityClassNames: Record<TaskPriority, string> = {
    high: 'priority-badge priority-high',
    medium: 'priority-badge priority-medium',
    low: 'priority-badge priority-low'
  };
  const taskStatusClassNames = {
    todo: 'status-badge task-status-todo',
    done: 'status-badge task-status-done'
  } as const;

  function setTitleValidationMessage(event: InvalidEvent<HTMLInputElement>) {
    if (event.currentTarget.validity.valueMissing) {
      event.currentTarget.setCustomValidity('タイトルを入力してください。');
      return;
    }

    event.currentTarget.setCustomValidity('');
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSaveEdits(task.id, { title, description, dueDate, priority });
      setIsEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleStatus() {
    setBusy(true);
    try {
      await onToggleStatus(task);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await onDeleteTask(task.id);
      setShowDeleteDialog(false);
    } finally {
      setBusy(false);
    }
  }

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setDueDate(task.dueDate ?? '');
    setPriority(task.priority);
    setIsEditing(true);
  }

  const titleInputId = `edit-title-${task.id}`;
  const descriptionInputId = `edit-description-${task.id}`;
  const dueDateInputId = `edit-due-date-${task.id}`;
  const priorityInputId = `edit-priority-${task.id}`;
  const dueStateClassName = `status-badge status-${task.dueState}`;
  const dueStateLabel = dueStateLabels[task.dueState];
  const priorityLabel = priorityLabels[task.priority];
  const dueDateLabel = task.dueDate ?? '未設定';

  return (
    <article className="task-row" aria-label={`タスク: ${task.title}`}>
      {isEditing ? (
        <form className="form-card" onSubmit={handleSave} aria-label={`タスク編集: ${task.title}`}>
          <label htmlFor={titleInputId}>
            <span>タイトル</span>
            <input
              id={titleInputId}
              name="title"
              type="text"
              required
              maxLength={120}
              placeholder="例: 買い物メモを更新する"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onInvalid={setTitleValidationMessage}
              onInput={(event) => event.currentTarget.setCustomValidity('')}
              disabled={busy}
            />
          </label>

          <label htmlFor={descriptionInputId}>
            <span>説明</span>
            <textarea
              id={descriptionInputId}
              name="description"
              maxLength={2000}
              placeholder="補足があれば入力してください"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={busy}
            />
          </label>

          <div className="form-grid">
            <label htmlFor={dueDateInputId}>
              <span>期限</span>
              <input
                id={dueDateInputId}
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={busy}
              />
            </label>

            <label htmlFor={priorityInputId}>
              <span>優先度</span>
              <select
                id={priorityInputId}
                name="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                disabled={busy}
              >
                <option value="low">{priorityLabels.low}</option>
                <option value="medium">{priorityLabels.medium}</option>
                <option value="high">{priorityLabels.high}</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} disabled={busy}>
              キャンセル
            </button>
            <button type="submit" className="primary-button" disabled={busy}>
              保存
            </button>
          </div>
        </form>
      ) : (
        <div className="task-main">
          <div className="task-header-row">
            <h3>{task.title}</h3>
            <button type="button" className="task-complete-button" onClick={() => void handleToggleStatus()} disabled={busy}>
              {task.status === 'done' ? '未完了に戻す' : '完了にする'}
            </button>
          </div>

          {task.description ? <p className="task-description">{task.description}</p> : null}

          <div className="task-meta-row">
            <div className="task-badges" aria-label="タスク状態情報">
              <span className={taskStatusClassNames[task.status]} aria-label={`状態: ${statusLabels[task.status]}`}>
                {statusLabels[task.status]}
              </span>
              <span className={priorityClassNames[task.priority]} aria-label={`優先度: ${priorityLabel}`}>
                {priorityLabel}
              </span>
              {dueStatusBadge ? (
                dueStatusBadge
              ) : (
                <span className={dueStateClassName} aria-label={`期限状況: ${dueStateLabel}`}>
                  {dueStateLabel}
                </span>
              )}
            </div>
            <p className="task-due-date" aria-label={`期限日: ${dueDateLabel}`}>
              {dueDateLabel}
            </p>
          </div>

          <p className="sr-only">優先度: {priorityLabel}</p>
          <p className="sr-only">期限: {dueDateLabel}</p>
          <p className="sr-only">期限状況: {dueStateLabel}</p>

          <div className="task-actions">
            <button type="button" className="primary-button" onClick={startEditing} disabled={busy}>
              編集
            </button>
            <button type="button" className="danger-button" onClick={() => setShowDeleteDialog(true)} disabled={busy}>
              削除
            </button>
          </div>
        </div>
      )}

      {showDeleteDialog ? (
        <DeleteTaskDialog
          idSuffix={task.id}
          taskTitle={task.title}
          confirming={busy}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      ) : null}
    </article>
  );
}
