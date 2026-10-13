# Syntecxhub Task Manager App

A full-stack task manager built with the **MERN** stack. Users register and log in with **JWT authentication**, then create, view, edit, complete and delete their own tasks. All task endpoints are protected by middleware, and every query is scoped to the logged-in user.

## Features

- Register and log in; passwords hashed with bcrypt
- JWT authentication (`Authorization: Bearer <token>`) with an auth middleware
- Full task CRUD, each task belongs to one user (no cross-user access)
- Task fields: title, description, status (pending / in-progress / completed), priority (low / medium / high), due date
- React dashboard: summary counters, progress bar, status tabs, priority filter, title search, overdue highlighting, edit and delete with confirmation
- Protected frontend routes and automatic logout when the token expires
- Security basics: helmet, CORS restriction, rate limiting on auth routes, request size limit, input whitelisting, central error handler

## Tech stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 18, Vite, React Router, Axios          |
| Backend  | Node.js, Express                             |
| Database | MongoDB with Mongoose                        |
| Auth     | JSON Web Tokens (jsonwebtoken), bcryptjs     |

## Project structure

```
Syntecxhub_Task_Manager_App/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # register, login, me
│   │   └── taskController.js         # task CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protect middleware
│   │   └── errorMiddleware.js        # 404 + central error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── app.js                        # Express app (middleware + routes)
│   ├── server.js                     # starts DB + server
│   ├── postman_collection.json       # import into Postman to test the API
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, TaskForm, TaskItem, TaskFilters, ProtectedRoute
│   │   ├── context/AuthContext.jsx   # login / register / logout state
│   │   ├── pages/                    # Login, Register, Dashboard
│   │   ├── services/                 # axios instance + task API calls
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, vite.config.js, package.json
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB running locally, **or** a free MongoDB Atlas cluster

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Edit `.env` and set `MONGO_URI` and a long random `JWT_SECRET`. To generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. In development, Vite proxies `/api` requests to the backend on port 5000, so no extra configuration is needed.

For production, build with `npm run build` and set `VITE_API_URL` (see `frontend/.env.example`) to your deployed API URL; also set `CLIENT_URL` in the backend `.env` to your frontend's origin.

## API reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint         | Access  | Body                         | Description              |
| ------ | ---------------- | ------- | ---------------------------- | ------------------------ |
| POST   | `/auth/register` | Public  | `name`, `email`, `password`  | Create account, returns user + token |
| POST   | `/auth/login`    | Public  | `email`, `password`          | Log in, returns user + token |
| GET    | `/auth/me`       | Private | none                         | Current user profile     |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint      | Description |
| ------ | ------------- | ----------- |
| GET    | `/tasks`      | List your tasks. Optional query: `status`, `priority`, `search` |
| GET    | `/tasks/:id`  | Get one task |
| POST   | `/tasks`      | Create a task (`title` required) |
| PUT    | `/tasks/:id`  | Update any of `title`, `description`, `status`, `priority`, `dueDate` |
| DELETE | `/tasks/:id`  | Delete a task |

Example:

```bash
# register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'

# create a task (replace TOKEN)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Finish report","priority":"high"}'
```

Error responses are JSON: `{ "message": "..." }` with status codes 400 (validation), 401 (missing/invalid token or bad credentials), 404 (not found), 409 (duplicate email).

## Testing with Postman

1. Import `backend/postman_collection.json` into Postman.
2. Run **Auth - Register** (or **Login**). A test script stores the token in the `token` collection variable.
3. Run the Task requests in order. **Tasks - Create** stores the new task's id in `taskId`.
4. Run **Security - Tasks without token**. It should return `401`.

## Security notes

- Passwords are hashed with bcrypt (salt rounds: 10) and never returned by the API (`select: false`).
- JWT secret and database URI live in `.env`, which is git-ignored. Never commit it.
- Task queries always include `user: req.user._id`, so a user cannot read, change or delete someone else's tasks (they get 404).
- Request bodies are whitelisted (`pickAllowed`) so clients cannot set the `user` field.
- Login returns the same message for unknown email and wrong password to avoid revealing which accounts exist.
- Auth routes are rate limited; JSON bodies are capped at 10 KB; `helmet` sets secure headers.
- The token is stored in `localStorage` for simplicity. For a production system, consider httpOnly cookies.

## Possible improvements

- Automated tests (Jest + Supertest with an in-memory MongoDB)
- Refresh tokens and password reset by email
- Pagination, due-date sorting, and task categories
- Deployment: backend on Render/Railway, frontend on Vercel/Netlify, database on MongoDB Atlas

## Author

Built for the Syntecxhub internship, Project 1: Task Manager App.
