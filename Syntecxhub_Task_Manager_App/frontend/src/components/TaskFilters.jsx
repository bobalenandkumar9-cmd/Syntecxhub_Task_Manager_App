const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters({ status, priority, search, onChange }) {
  return (
    <div className="filters">
      <div className="tabs" role="tablist" aria-label="Filter by status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={status === tab.value}
            className={`tab ${status === tab.value ? 'tab--active' : ''}`}
            onClick={() => onChange({ status: tab.value })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="filters__right">
        <input
          type="search"
          className="filters__search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search tasks by title"
        />
        <select
          value={priority}
          onChange={(e) => onChange({ priority: e.target.value })}
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
