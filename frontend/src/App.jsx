import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- AnimatedNumber Component ---
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    if (startValue === endValue) return;
    
    const duration = 300;
    const steps = 15;
    const diff = endValue - startValue;
    const stepValue = diff / steps;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const nextValue = Math.round(startValue + (stepValue * step));
      setDisplayValue(nextValue);
      if (step >= steps) {
        setDisplayValue(endValue);
        clearInterval(interval);
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [value]); // intentionally not including displayValue 
  
  return <>{displayValue}</>;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");
  const [toasts, setToasts] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set()); // For sliding out animations

  // ── Toasts functions ──
  function showToast(message, type = "info") {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  // ── Fetch all tasks on mount ──
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      showToast("Could not load tasks. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Add task ──
  async function handleAddTask() {
    const trimmed = title.trim();
    if (!trimmed) {
      showToast("Please enter a task title", "error");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      showToast("Task added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add task", "error");
    } finally {
      setAdding(false);
    }
  }

  // ── Toggle task ──
  async function handleToggle(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Optimistic UI update
    const newCompleted = !task.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) {
        // revert optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !newCompleted } : t));
        throw new Error("Failed to toggle task");
      }
      showToast(newCompleted ? "Task completed!" : "Task marked as pending", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update task", "error");
    }
  }

  // ── Delete task ──
  async function handleDelete(id) {
    // Add to removing set to trigger animation
    setRemovingIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    // Wait for animation
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete task");
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast("Task deleted", "info");
      } catch (err) {
        console.error(err);
        showToast("Failed to delete task", "error");
      } finally {
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }, 300); // match the CSS slideOut duration
  }

  // ── Format date ──
  function formatTime(isoString) {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const total = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = total - completedCount;

  return (
    <>
      <div className="bg-pattern"></div>

      <div className="toast-container" id="toastContainer">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`} style={{ animation: "toastIn 0.4s ease" }}>
            {t.type === 'success' && <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
            {t.type === 'error' && <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>}
            {t.type === 'info' && <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-badge">
            <span className="dot"></span>
            ZoraDev Task Manager
          </div>
          <h1>Manage Your <span>Tasks</span></h1>
          <p>Stay organized, get things done. Add, complete, and delete tasks with ease.</p>
        </header>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card total">
            <div className="stat-value"><AnimatedNumber value={total} /></div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value"><AnimatedNumber value={pendingCount} /></div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value"><AnimatedNumber value={completedCount} /></div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              className="task-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
              disabled={adding}
              autoComplete="off"
            />
            <button className="add-btn" onClick={handleAddTask} disabled={adding}>
              {adding ? (
                <>
                  <svg className="spinner" style={{width:"18px",height:"18px",borderWidth:"2px",margin:"0"}} viewBox="0 0 24 24"></svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Tasks</button>
          <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        {/* Tasks Container */}
        <div className="tasks-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <h3>
                {filter === 'all' ? 'No tasks yet' : filter === 'pending' ? 'No pending tasks' : 'No completed tasks'}
              </h3>
              <p>
                {filter === 'all' ? 'Add your first task above to get started!' : filter === 'pending' ? 'Great job! All tasks are completed.' : 'Complete some tasks to see them here.'}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${removingIds.has(task.id) ? 'removing' : ''}`} data-task-id={task.id}>
                  <div className="checkbox-wrapper">
                    <div className="custom-checkbox" onClick={() => handleToggle(task.id)}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                  <div className="task-content">
                    <div className="task-text">{task.title}</div>
                    <div className="task-meta">
                      <span className="task-time">{formatTime(task.createdAt)}</span>
                      <span className={`task-badge ${task.completed ? 'completed' : 'pending'}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(task.id)} title="Delete task">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
