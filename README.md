# 🚀 Syntecxhub Task Manager App

A full-stack task management web application built using the **MERN stack**. It helps users organize their daily activities, manage priorities, track deadlines, and monitor task completion through an interactive dashboard.

The application includes secure user authentication, personal task management, search and filtering, and a responsive user interface.

## ✨ Features

### 🔐 User Authentication
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected routes for authenticated users.
- User-specific task access.

### 📝 Task Management
- Create new tasks with a title and description.
- Edit existing tasks.
- Delete tasks with confirmation.
- Mark tasks as completed.
- Set task priorities: Low, Medium, and High.
- Manage task statuses: Pending, In Progress, and Completed.
- Set due dates for tasks.

### 📊 Interactive Dashboard
- View total, pending, in-progress, and completed task counts.
- Track task completion using a progress bar.
- Filter tasks by status and priority.
- Search tasks by title.
- Highlight overdue tasks.
- View tasks in an organized interface.

### 🎨 Modern User Interface
- Clean dashboard design.
- Responsive layouts for desktop, tablet, and mobile devices.
- Interactive buttons, cards, and hover effects.
- Clear status and priority indicators.
- User-friendly forms and navigation.

### 🛡️ Security
- Password hashing.
- JWT authentication middleware.
- Protected task API endpoints.
- Request rate limiting for authentication routes.
- HTTP security headers using Helmet.
- Input validation and centralized error handling.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| React Router | Client-side navigation |
| Axios | HTTP requests to the backend |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| CSS | Responsive styling and UI design |

## 📁 Project Structure

```text
Syntecxhub_Task_Manager_App/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) — version 18 or newer.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account.
- [Git](https://git-scm.com/).
- A code editor such as Visual Studio Code.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/syntecxhub-task-manager.git
```

Navigate to the project folder:

```bash
cd syntecxhub-task-manager
```

Replace `YOUR_USERNAME` with your GitHub username and use your actual repository name if it differs.

### 2. Configure the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file by copying the example file.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/syntecxhub_task_manager
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Make sure MongoDB is running, or replace `MONGO_URI` with your MongoDB Atlas connection string.

Generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the backend server:

```bash
npm run dev
```

Alternatively, run:

```bash
npm start
```

The backend should start on `http://localhost:5000`.

Health check endpoint:

```text
http://localhost:5000/api/health
```

### 3. Configure the Frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the URL displayed in the terminal, usually:

```text
http://localhost:5173
```

The Vite development server proxies API requests to the backend running on port 5000.

### 4. Build for Production

To create a production frontend build:

```bash
cd frontend
npm run build
```

To preview the generated build locally:

```bash
npm run preview
```

For deployment, configure `VITE_API_URL` to point to your deployed backend API and set `CLIENT_URL` in the backend environment to your deployed frontend origin.

## 🔗 API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Get the authenticated user's profile |

### Task Management

All task endpoints require a valid JWT access token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve the user's tasks |
| GET | `/tasks/:id` | Retrieve a specific task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

Task listing supports optional status, priority, and search query parameters.

Authenticated requests should include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔄 Application Workflow

1. A user registers or logs in.
2. The backend validates the credentials and issues a JWT.
3. The frontend uses the token for protected API requests.
4. The user creates and manages personal tasks.
5. The backend stores task information in MongoDB.
6. The dashboard displays task counts, status, priorities, and progress.
7. Users can search, filter, update, complete, or delete tasks.

## 🔮 Future Enhancements

Potential improvements for future versions include:

- Email and push notifications for approaching deadlines.
- Calendar integration.
- Drag-and-drop task organization.
- Dark mode.
- Team collaboration and task sharing.
- Charts for productivity analysis.
- Deployment with a live demo.

## 🔒 Environment Variables

Never upload your real `.env` files, database passwords, JWT secrets, or other credentials to a public repository.

Use `.env.example` to document the required configuration variables without including real secrets.

## 👨‍💻 Author
Nandkumar Bobale

- GitHub: "https://github.com/bobalenandkumar9-cmd"
- Project: Task Manager App

## 📄 License

This project is licensed under the MIT License, as declared in the backend package configuration.

---

⭐ If you find this project useful, consider giving the repository a star!
