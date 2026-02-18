import { DueStatusBadge } from './DueStatusBadge.js';
import { TaskItem } from './TaskItem.js';
import type { Task } from '../services/taskTypes.js';

type TaskListProps = {
  tasks: Task[];
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
  onSaveEdits: (taskId: string, values: { title: string; description: string }) => Promise<void>;
  onToggleStatus: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

function getSortCue(sortBy: TaskListProps['sortBy'], sortOrder: TaskListProps['sortOrder']) {
  if (sortBy === 'dueDate') {
    return {
      short: `Due date order ${sortOrder === 'asc' ? '↑' : '↓'}`,
      detail:
        sortOrder === 'asc' ? 'Due date: earliest first (ascending).' : 'Due date: latest first (descending).'
    };
  }

  if (sortBy === 'priority') {
    return {
      short: `Priority order ${sortOrder === 'asc' ? '↑' : '↓'}`,
      detail:
        sortOrder === 'asc'
          ? 'Priority sequence: Low, Medium, High (ascending).'
          : 'Priority sequence: High, Medium, Low (descending).'
    };
  }

  return {
    short: `Created time ${sortOrder === 'desc' ? 'newest first' : 'oldest first'}`,
    detail:
      sortOrder === 'desc'
        ? 'Created time order: newest first (descending).'
        : 'Created time order: oldest first (ascending).'
  };
}

export function TaskList({ tasks, sortBy, sortOrder, onSaveEdits, onToggleStatus, onDeleteTask }: TaskListProps) {
  const sortCue = getSortCue(sortBy, sortOrder);
  const sortCueId = 'task-list-sort-cue';

  return (
    <>
      <p id={sortCueId} aria-live="polite">
        <strong>Sort:</strong> {sortCue.short}. {sortCue.detail}
      </p>
      <ul aria-label="Tasks" aria-describedby={sortCueId}>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              task={task}
              onSaveEdits={onSaveEdits}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
              dueStatusBadge={<DueStatusBadge dueDate={task.dueDate} />}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
