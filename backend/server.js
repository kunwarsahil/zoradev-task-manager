// ─── Mini Task Manager — Backend Server ───
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── In-memory task storage ──
let tasks = [];
let nextId = 1;

// ── Health check (useful for Render) ──
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Task Manager API is running 🚀" });
});

// ── GET /tasks — return all tasks ──
app.get("/tasks", (_req, res) => {
  res.json(tasks);
});

// ── POST /tasks — create a new task ──
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validate: title is required and must not be empty
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required and cannot be empty." });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ── DELETE /tasks/:id — delete a task by ID ──
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.json({ message: "Task deleted.", task: deleted });
});

// ── PATCH /tasks/:id/toggle — toggle completed status ──
app.patch("/tasks/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  task.completed = !task.completed;
  res.json(task);
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
