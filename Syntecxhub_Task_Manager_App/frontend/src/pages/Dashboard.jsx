import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import TaskFilters from '../components/TaskFilters';
import * as taskService from '../services/taskService';
import { getErrorMessage } from '../services/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await taskService.fetchTasks());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // --- CRUD handlers -------------------------------------------------------
  const handleSubmit = async (data) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask._id, data);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await taskService.createTask(data);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      // TaskForm shows this message inside the form
      throw new Error(getErrorMessage(err));
    }
  };

  const handleToggle = async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await taskService.updateTask(task._id, { status });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      await taskService.deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      if (editingTask?._id === task._id) setEditingTask(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Derived data --------------------------------------------------------
  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (!filters.status || t.status === filters.status) &&
        (!filters.priority || t.priority === filters.priority) &&
        (!q || t.title.toLowerCase().includes(q))
    );
  }, [tasks, filters]);

  const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <section className="dashboard__intro">
          <div>
            <div className="dashboard__eyebrow">Your workspace</div>
            <h1 className="dashboard__heading">Good to see you 👋</h1>
            <p className="dashboard__subtitle">Keep your focus, organise your tasks, and make today count.</p>
          </div>
          <div className="dashboard__date">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </section>

        <section className="stats" aria-label="Task summary">
          <button type="button" className={`stat stat--clickable ${!filters.status ? 'stat--selected' : ''}`} onClick={() => setFilters((f) => ({ ...f, status: '' }))} aria-label={`Show all tasks, ${stats.total} total`}>
            <span className="stat__icon" aria-hidden="true">✦</span>
            <span className="stat__value">{stats.total}</span>
            <span className="stat__label">Total tasks <span className="stat__hint">View all ↗</span></span>
          </button>
          <button type="button" className={`stat stat--pending stat--clickable ${filters.status === 'pending' ? 'stat--selected' : ''}`} onClick={() => setFilters((f) => ({ ...f, status: 'pending' }))} aria-label={`Filter pending tasks, ${stats.pending}`}>
            <span className="stat__icon" aria-hidden="true">◷</span>
            <span className="stat__value">{stats.pending}</span>
            <span className="stat__label">Pending <span className="stat__hint">Filter ↗</span></span>
          </button>
          <button type="button" className={`stat stat--progress stat--clickable ${filters.status === 'in-progress' ? 'stat--selected' : ''}`} onClick={() => setFilters((f) => ({ ...f, status: 'in-progress' }))} aria-label={`Filter in progress tasks, ${stats.inProgress}`}>
            <span className="stat__icon" aria-hidden="true">↗</span>
            <span className="stat__value">{stats.inProgress}</span>
            <span className="stat__label">In progress <span className="stat__hint">Filter ↗</span></span>
          </button>
          <button type="button" className={`stat stat--done stat--clickable ${filters.status === 'completed' ? 'stat--selected' : ''}`} onClick={() => setFilters((f) => ({ ...f, status: 'completed' }))} aria-label={`Filter completed tasks, ${stats.completed}`}>
            <span className="stat__icon" aria-hidden="true">✓</span>
            <span className="stat__value">{stats.completed}</span>
            <span className="stat__label">Completed <span className="stat__hint">Celebrate ↗</span></span>
          </button>
        </section>

        <div className="progress-wrap">
          <div className="progress-caption"><span><strong>{progress}%</strong> of your tasks completed</span><span>{stats.completed} of {stats.total}</span></div>
          <div className="progress" role="progressbar" aria-label="Tasks completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} title={`${progress}% completed`}>
            <div className="progress__bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="dashboard__grid">
          <TaskForm
            editingTask={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => setEditingTask(null)}
          />

          <section className="card">
            <div className="tasks-heading"><div><h2 className="card__title">Your tasks</h2><p className="tasks-heading__sub">A little progress every day adds up.</p></div><span className="task-count">{visibleTasks.length} shown</span></div>

            <TaskFilters
              {...filters}
              onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            />

            {error && (
              <div className="alert alert--error" role="alert">
                {error}{' '}
                <button className="link-btn" onClick={loadTasks}>Retry</button>
              </div>
            )}

            {loading ? (
              <p className="empty">Loading your tasks...</p>
            ) : visibleTasks.length === 0 ? (
              <p className="empty">
                {tasks.length === 0
                  ? 'No tasks yet. Add your first task using the form.'
                  : 'No tasks match your filters.'}
              </p>
            ) : (
              <ul className="task-list">
                {visibleTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
