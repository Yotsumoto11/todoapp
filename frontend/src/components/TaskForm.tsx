import { useState, type FormEvent, type InvalidEvent } from 'react';

import type { TaskPriority } from '../services/taskTypes.js';

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
};

type TaskFormProps = {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  submitting: boolean;
};

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium'
};

const priorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高'
};

export function TaskForm({ onSubmit, submitting }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);

  function setTitleValidationMessage(event: InvalidEvent<HTMLInputElement>) {
    if (event.currentTarget.validity.valueMissing) {
      event.currentTarget.setCustomValidity('タイトルを入力してください。');
      return;
    }

    event.currentTarget.setCustomValidity('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onSubmit(values);
      setValues(initialValues);
    } catch {
      // Parent handles error presentation; keep current field values for correction.
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} aria-label="タスク作成フォーム">
      <label htmlFor="task-title">
        <span>タイトル</span>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="例: 牛乳を買う"
          value={values.title}
          onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          onInvalid={setTitleValidationMessage}
          onInput={(event) => event.currentTarget.setCustomValidity('')}
        />
      </label>

      <label htmlFor="task-description">
        <span>説明</span>
        <textarea
          id="task-description"
          name="description"
          maxLength={2000}
          placeholder="補足があれば入力してください"
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        />
      </label>

      <div className="form-grid">
        <label htmlFor="task-due-date">
          <span>期限</span>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            className="compact-date-input"
            value={values.dueDate}
            onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
          />
        </label>

        <label htmlFor="task-priority">
          <span>優先度</span>
          <select
            id="task-priority"
            name="priority"
            className="compact-priority-select"
            value={values.priority}
            onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
          >
            <option value="low">{priorityLabels.low}</option>
            <option value="medium">{priorityLabels.medium}</option>
            <option value="high">{priorityLabels.high}</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? '作成中…' : 'タスクを作成'}
        </button>
      </div>
    </form>
  );
}
