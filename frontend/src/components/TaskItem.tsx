import { useState, type FormEvent } from 'react';

import type { Task } from '../services/taskTypes.js';
import { DeleteTaskDialog } from './DeleteTaskDialog.js';

type EditTaskValues = {
  title: string;
  description: string;
};

type TaskItemProps = {
  task: Task;
  onSaveEdits: (taskId: string, values: EditTaskValues) => Promise<void>;
  onToggleStatus: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export function TaskItem({ task, onSaveEdits, onToggleStatus, onDeleteTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSaveEdits(task.id, { title, description });
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
    setIsEditing(true);
  }

  const titleInputId = `edit-title-${task.id}`;
  const descriptionInputId = `edit-description-${task.id}`;

  return (
    <article aria-label={`Task ${task.title}`}>
      {isEditing ? (
        <form onSubmit={handleSave} aria-label={`Edit ${task.title}`}>
          <div>
            <label htmlFor={titleInputId}>Title</label>
            <input
              id={titleInputId}
              name="title"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor={descriptionInputId}>Description</label>
            <textarea
              id={descriptionInputId}
              name="description"
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={busy}
            />
          </div>

          <button type="submit" disabled={busy}>
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)} disabled={busy}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <p>Due date: {task.dueDate ?? 'None'}</p>
          {task.description ? <p>{task.description}</p> : null}
          <div>
            <button type="button" onClick={() => void handleToggleStatus()} disabled={busy}>
              {task.status === 'done' ? 'Reopen' : 'Complete'}
            </button>
            <button type="button" onClick={startEditing} disabled={busy}>
              Edit
            </button>
            <button type="button" onClick={() => setShowDeleteDialog(true)} disabled={busy}>
              Delete
            </button>
          </div>
        </>
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
