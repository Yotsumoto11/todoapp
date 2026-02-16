# Data Model: TODO Management Web App

## Entity: Task

### Fields
- `id` (string, UUID, required, immutable)
- `title` (string, required, 1..120 chars)
- `description` (string, optional, max 2000 chars)
- `status` (enum: `todo` | `done`, required)
- `dueDate` (date, optional)
- `priority` (enum: `low` | `medium` | `high`, default `medium`)
- `createdAt` (datetime, required, immutable)
- `updatedAt` (datetime, required)
- `completedAt` (datetime, optional; required when status is `done`)

### Validation Rules
- Title MUST be non-empty after trim.
- Title length MUST be <= 120 characters.
- Description length MUST be <= 2000 characters.
- `dueDate` (if present) MUST be a valid calendar date.
- `completedAt` MUST be null when status is `todo`.
- `completedAt` MUST be non-null when status is `done`.

### State Transitions
- `todo -> done`: allowed; sets `completedAt` to operation timestamp.
- `done -> todo`: allowed; clears `completedAt`.
- `todo -> todo`: allowed for content edits only.
- `done -> done`: allowed for content edits only.

## Entity: TaskListQuery

### Fields
- `status` (optional enum: `todo` | `done`)
- `dueWindow` (optional enum: `overdue` | `today` | `upcoming` | `none`)
- `sortBy` (optional enum: `createdAt` | `dueDate` | `priority`)
- `sortOrder` (optional enum: `asc` | `desc`, default `asc`)
- `page` (optional integer >= 1, default 1)
- `pageSize` (optional integer 1..100, default 20)

### Validation Rules
- `sortOrder` is valid only when `sortBy` is provided.
- `dueWindow=none` returns tasks without due date.
- Missing filters imply full task list retrieval.

## Relationship Notes
- `TaskListQuery` is a read-model input and does not persist as a standalone table.
- All user stories map to `Task` as the primary mutable entity.
