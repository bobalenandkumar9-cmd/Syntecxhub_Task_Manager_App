import { useEffect, useState } from 'react';

const EMPTY = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

// Converts an ISO date from the API to the yyyy-mm-dd format <input type="date"> needs
const toDateInput = (iso) => (iso ? iso.slice(0, 10) : '');

/**
 * Used for both creating and editing.
 * When `editingTask` is provided the form is pre-filled and submits an update.
 */
export default function TaskForm({ editingTask, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setError('');
    setForm(
      editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description || '',
            priority: editingTask.priority,
            status: editingTask.status,
            dueDate: toDateInput(editingTask.dueDate),
          }
        : EMPTY
    );
  }, [editingTask]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please enter a task title');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null,
      });
      if (!editingTask) setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">{editingTask ? 'Edit task' : 'Add a new task'}</h2>

      {error && <div className="alert alert--error" role="alert">{error}</div>}

      <label className="field">
        <span>Title</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
          placeholder="e.g. Finish internship report"
        />
      </label>

      <label className="field">
        <span>Description <small>(optional)</small></span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          rows={3}
          placeholder="Add some details..."
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Priority</span>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="field">
          <span>Due date</span>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving...' : editingTask ? 'Save changes' : 'Add task'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
