export type TaskFilterStatus = 'all' | 'active' | 'completed';
export type TaskSortValue = 'newest' | 'oldest' | 'dueDateAsc' | 'dueDateDesc' | 'priorityAsc' | 'priorityDesc';

export type TaskFilterValues = {
  status: TaskFilterStatus;
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

  return (
    <form aria-label="Task list controls" onSubmit={(event) => event.preventDefault()}>
      <div>
        <label htmlFor="task-filter-status">Filter by status</label>
        <select
          id="task-filter-status"
          name="status"
          value={values.status}
          onChange={(event) => handleStatusChange(event.target.value as TaskFilterStatus)}
        >
          <option value="all">All tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-filter-sort">Sort tasks</label>
        <select
          id="task-filter-sort"
          name="sort"
          value={values.sort}
          onChange={(event) => handleSortChange(event.target.value as TaskSortValue)}
          aria-describedby="task-filter-sort-help"
        >
          <option value="newest">Newest created first</option>
          <option value="oldest">Oldest created first</option>
          <option value="dueDateAsc">Due date: earliest first</option>
          <option value="dueDateDesc">Due date: latest first</option>
          <option value="priorityAsc">Priority: low to high</option>
          <option value="priorityDesc">Priority: high to low</option>
        </select>
        <p id="task-filter-sort-help">Sorting updates the list immediately.</p>
      </div>
    </form>
  );
}
