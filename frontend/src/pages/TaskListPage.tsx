import { useEffect, useState } from 'react';

import { TaskForm, type TaskFormValues } from '../components/TaskForm.js';
import { TaskItem } from '../components/TaskItem.js';
import { createTask, deleteTask, listTasks, updateTask } from '../services/taskApi.js';
import type { Task } from '../services/taskTypes.js';

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await listTasks({ page: 1, pageSize: 50 });
      setTasks(response.items);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleCreateTask(values: TaskFormValues) {
    setSubmitting(true);
    try {
      const createdTask = await createTask({
        title: values.title,
        ...(values.description ? { description: values.description } : {}),
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        priority: values.priority
      });
      setTasks((current) => [createdTask, ...current]);
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create task');
      throw createError;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdits(taskId: string, values: { title: string; description: string }) {
    try {
      const updatedTask = await updateTask(taskId, {
        title: values.title,
        description: values.description ? values.description : null
      });
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
      setError(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update task');
      throw updateError;
    }
  }

  async function handleToggleStatus(task: Task) {
    try {
      const updatedTask = await updateTask(task.id, {
        status: task.status === 'done' ? 'todo' : 'done'
      });
      setTasks((current) => current.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask)));
      setError(null);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update task status');
      throw toggleError;
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete task');
      throw deleteError;
    }
  }

  return (
    <main>
      <h1>TODO Management</h1>

      <section aria-labelledby="create-task-heading">
        <h2 id="create-task-heading">Create task</h2>
        <TaskForm onSubmit={handleCreateTask} submitting={submitting} />
      </section>

      {error ? (
        <p role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      <section aria-labelledby="task-list-heading">
        <h2 id="task-list-heading">Task list</h2>
        {loading ? <p>Loading tasks…</p> : null}
        {!loading && tasks.length === 0 ? <p>No tasks yet.</p> : null}
        {!loading && tasks.length > 0 ? (
          <ul aria-label="Tasks">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onSaveEdits={handleSaveEdits}
                  onToggleStatus={handleToggleStatus}
                  onDeleteTask={handleDeleteTask}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
