import { useCallback, useEffect, useMemo, useState } from 'react';

import { TaskForm, type TaskFormValues } from '../components/TaskForm.js';
import { TaskFilters, type TaskFilterValues } from '../components/TaskFilters.js';
import { TaskList } from '../components/TaskList.js';
import { createTask, deleteTask, listTasks, updateTask } from '../services/taskApi.js';
import type { Task, TaskListQuery } from '../services/taskTypes.js';

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterValues>({
    status: 'all',
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
    [filters.sort, filters.status]
  );

  const loadTasks = useCallback(async (query: TaskListQuery) => {
    setLoading(true);
    try {
      const response = await listTasks(query);
      setTasks(response.items);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load tasks');
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
      setError(createError instanceof Error ? createError.message : 'Failed to create task');
      throw createError;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveEdits(taskId: string, values: { title: string; description: string }) {
    try {
      await updateTask(taskId, {
        title: values.title,
        description: values.description ? values.description : null
      });
      await loadTasks(taskQuery);
      setError(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update task');
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
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update task status');
      throw toggleError;
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
      await loadTasks(taskQuery);
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
        <TaskFilters values={filters} onChange={setFilters} />
        <p aria-live="polite">{loading ? 'Loading filtered tasks…' : `${tasks.length} tasks shown`}</p>
        {loading ? <p>Loading tasks…</p> : null}
        {!loading && tasks.length === 0 ? <p>No tasks match the selected filters.</p> : null}
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
    </main>
  );
}
