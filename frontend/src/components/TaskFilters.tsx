export type TaskFilterStatus = 'all' | 'active' | 'completed';
export type TaskSortValue = 'newest' | 'oldest' | 'dueDateAsc' | 'dueDateDesc' | 'priorityAsc' | 'priorityDesc';
export type TaskDueWindow = 'all' | 'overdue' | 'dueSoon' | 'upcoming' | 'none';

export type TaskFilterValues = {
  status: TaskFilterStatus;
  dueWindow: TaskDueWindow;
  sort: TaskSortValue;
};

type TaskFiltersProps = {
  values: TaskFilterValues;
  onChange: (values: TaskFilterValues) => void;
};

export function TaskFilters({ values, onChange }: TaskFiltersProps) {
  function handleStatusChange(status: TaskFilterStatus) {
    onChange({ ...values, status });
  }

  function handleSortChange(sort: TaskSortValue) {
    onChange({ ...values, sort });
  }

  function handleDueWindowChange(dueWindow: TaskDueWindow) {
    onChange({ ...values, dueWindow });
  }

  return (
    <form className="toolbar-group" aria-label="タスク一覧の絞り込みと並び替え" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="task-filter-status">
        <span>状態</span>
        <select
          id="task-filter-status"
          name="status"
          value={values.status}
          onChange={(event) => handleStatusChange(event.target.value as TaskFilterStatus)}
        >
          <option value="all">すべて</option>
          <option value="active">未完了</option>
          <option value="completed">完了</option>
        </select>
      </label>

      <label htmlFor="task-filter-due-window">
        <span>期限</span>
        <select
          id="task-filter-due-window"
          name="dueWindow"
          value={values.dueWindow}
          onChange={(event) => handleDueWindowChange(event.target.value as TaskDueWindow)}
        >
          <option value="all">すべて</option>
          <option value="overdue">期限切れ</option>
          <option value="dueSoon">期限が近い</option>
          <option value="upcoming">期限あり</option>
          <option value="none">期限なし</option>
        </select>
      </label>

      <label htmlFor="task-filter-sort">
        <span>並び順</span>
        <select
          id="task-filter-sort"
          name="sort"
          value={values.sort}
          onChange={(event) => handleSortChange(event.target.value as TaskSortValue)}
          aria-describedby="task-filter-sort-help"
        >
          <option value="newest">作成日時が新しい順</option>
          <option value="oldest">作成日時が古い順</option>
          <option value="dueDateAsc">期限が近い順</option>
          <option value="dueDateDesc">期限が遠い順</option>
          <option value="priorityAsc">優先度が低い順</option>
          <option value="priorityDesc">優先度が高い順</option>
        </select>
      </label>

      <p id="task-filter-sort-help" className="sr-only">
        選択すると一覧がすぐに更新されます。
      </p>
    </form>
  );
}
