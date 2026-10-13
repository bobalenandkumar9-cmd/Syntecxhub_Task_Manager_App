const STATUS_LABEL = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'completed';
  const overdue = task.dueDate && !done && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <li className={`task ${done ? 'task--done' : ''}`}>
      <input
        type="checkbox"
        className="task__check"
        checked={done}
        onChange={() => onToggle(task)}
        aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
      />

      <div className="task__body">
        <div className="task__title">{task.title}</div>
        {task.description && <p className="task__desc">{task.description}</p>}
        <div className="task__meta">
          <span className={`badge badge--status-${task.status}`}>{STATUS_LABEL[task.status]}</span>
          <span className={`badge badge--priority-${task.priority}`}>{task.priority} priority</span>
          {task.dueDate && (
            <span className={`task__due ${overdue ? 'task__due--overdue' : ''}`}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task__actions">
        <button className="btn btn--small btn--ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn--small btn--danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </li>
  );
}
