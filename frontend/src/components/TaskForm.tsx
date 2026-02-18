import { useState, type FormEvent } from 'react';

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

export function TaskForm({ onSubmit, submitting }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);

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
    <form onSubmit={handleSubmit} aria-label="Create task form">
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          maxLength={120}
          value={values.title}
          onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          maxLength={2000}
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="task-due-date">Due date</label>
        <input
          id="task-due-date"
          name="dueDate"
          type="date"
          value={values.dueDate}
          onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          name="priority"
          value={values.priority}
          onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating…' : 'Create task'}
      </button>
    </form>
  );
}
