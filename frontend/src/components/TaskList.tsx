import { DueStatusBadge } from './DueStatusBadge.js';
import { TaskItem } from './TaskItem.js';
import type { Task, TaskPriority } from '../services/taskTypes.js';

type TaskListProps = {
  tasks: Task[];
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
  onSaveEdits: (taskId: string, values: { title: string; description: string; dueDate: string; priority: TaskPriority }) => Promise<void>;
  onToggleStatus: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

function getSortCue(sortBy: TaskListProps['sortBy'], sortOrder: TaskListProps['sortOrder']) {
  if (sortBy === 'dueDate') {
    return {
      short: `期限順 ${sortOrder === 'asc' ? '↑' : '↓'}`,
      detail: sortOrder === 'asc' ? '期限が近い順で表示しています。' : '期限が遠い順で表示しています。'
    };
  }

  if (sortBy === 'priority') {
    return {
      short: `優先度順 ${sortOrder === 'asc' ? '↑' : '↓'}`,
      detail:
        sortOrder === 'asc'
          ? '優先度が低いものから高いものへ表示しています。'
          : '優先度が高いものから低いものへ表示しています。'
    };
  }

  return {
    short: `作成日時 ${sortOrder === 'desc' ? '新しい順' : '古い順'}`,
    detail:
      sortOrder === 'desc' ? '作成日時が新しい順で表示しています。' : '作成日時が古い順で表示しています。'
  };
}

export function TaskList({ tasks, sortBy, sortOrder, onSaveEdits, onToggleStatus, onDeleteTask }: TaskListProps) {
  const sortCue = getSortCue(sortBy, sortOrder);
  const sortCueId = 'task-list-sort-cue';

  return (
    <>
      <p id={sortCueId} aria-live="polite">
        <strong>並び順:</strong> {sortCue.short}。{sortCue.detail}
      </p>
      <ul aria-label="タスク一覧" aria-describedby={sortCueId}>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              task={task}
              onSaveEdits={onSaveEdits}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
              dueStatusBadge={<DueStatusBadge dueState={task.dueState} />}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
