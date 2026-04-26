# 📋 Mini Task Manager App

A simple, clean full-stack task manager where you can **add**, **view**, **delete**, and **toggle** tasks as complete/incomplete.

Built as a selection task for the **Full Stack Developer Intern** position at **ZoraDev**.

---

## ✨ Features

- ✅ Add new tasks
- ✅ View all tasks
- ✅ Delete tasks
- ✅ Toggle task complete / incomplete
- ✅ Input validation (empty tasks rejected)
- ✅ Loading & error states
- ✅ Responsive, clean UI
- ✅ Empty-state message when no tasks exist

---

## 🛠️ Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React + Vite      |
| Backend  | Node.js + Express |
| Storage  | In-memory JS array|
| Styling  | Plain CSS         |

---

## 📁 Folder Structure

```
task-manager-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── App.css
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/`                   | Health check             |
| GET    | `/tasks`              | Get all tasks            |
| POST   | `/tasks`              | Create a new task        |
| DELETE | `/tasks/:id`          | Delete a task by ID      |
| PATCH  | `/tasks/:id/toggle`   | Toggle completed status  |

### Request / Response Examples

**POST /tasks**

*Request body:*
```json
{ "title": "Buy groceries" }
```

*Response (201 Created):*
```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-04-26T10:00:00.000Z"
}
```

**POST /tasks — validation error**

*Request body:*
```json
{ "title": "" }
```

*Response (400 Bad Request):*
```json
{ "error": "Title is required and cannot be empty." }
```

---

## 🚀 How to Run Locally

### Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/task-manager-app.git
cd task-manager-app
```

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env     # optional — defaults to port 5000
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env     # optional — defaults to http://localhost:5000
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description         |
|----------|---------|---------------------|
| `PORT`   | `5000`  | Server port number  |

### Frontend (`frontend/.env`)

| Variable       | Default                  | Description          |
|----------------|--------------------------|----------------------|
| `VITE_API_URL` | `http://localhost:5000`  | Backend API base URL |

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub.
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable: `PORT` = `5000` (Render also sets this automatically).
6. Deploy. Note the live URL (e.g., `https://task-manager-xxxx.onrender.com`).

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**.
2. Import your GitHub repo.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add environment variable:
   - `VITE_API_URL` = `https://task-manager-xxxx.onrender.com` (your Render backend URL)
5. Deploy.

---

## 📌 Assumptions & Decisions

- **No database used** — tasks are stored in a plain JavaScript array in server memory.
- **Data resets** when the backend server restarts — this is intentional and acceptable per the task requirements.
- **In-memory storage** was chosen because the task explicitly allowed it; no external database was required.

---

## 📬 Submission

| Item              | Link |
|-------------------|------|
| GitHub Repository | `<your-github-repo-link>` |
| Frontend (Vercel) | `<your-vercel-live-link>` |
| Backend (Render)  | `<your-render-live-link>` |

---

## 👤 Author

**Kunwar Sahil Darshan**

Built with ❤️ for the ZoraDev Full Stack Developer Intern selection task.
