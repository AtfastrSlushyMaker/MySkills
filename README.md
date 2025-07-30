# MySkills

<p align="center">
  <img src="frontend/public/logos/myskills-logo-icon.png" alt="MySkills Logo" width="120" />
</p>

[![Laravel](https://img.shields.io/badge/Laravel-12-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://mysql.com)

---

## 📋 Overview

MySkills is a full-stack web application for managing skills, training courses, sessions, and user progress. It features a robust Laravel (PHP) backend, a modern React (Vite) frontend, and a dedicated admin backoffice. The project supports multiple user roles (admin, coordinator, trainer, trainee) and provides a rich set of features for course/session management, feedback, notifications, and analytics.

**Duration**: 6 weeks (June 26 - August 6, 2025)  
**Status**: 🚀 In Development (Esprit Summer Internship Project 2025)

---

## 🎯 Key Features & Workflow

- User authentication and role-based access (admin, coordinator, trainer, trainee)
- Category, course, and session management
- Registration and attendance tracking
- Feedback and notifications (in-app and email)
- Profile management with image upload
- Responsive dashboards for each user role
- RESTful API with validation and error handling
- Admin analytics and CRUD for all resources
- Glassmorphism UI: Modern, responsive design with animated navigation and profile cards

---

## 🛠️ Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React.js 18.3, Ant Design, Tailwind CSS
- **Database**: MySQL 8.0 (default: SQLite for dev)
- **Build Tools**: Vite, Composer, npm
- **Version Control**: Git + GitHub

---

## 👥 User Roles & Permissions

| Role        | Permissions |
|-------------|-------------|
| Admin       | Full access, user management, platform settings |
| Coordinator | Create sessions, assign trainers, accept/reject trainee registrations, view attendance/feedback |
| Trainer     | Create/manage courses within sessions, mark attendance, view feedback |
| Trainee     | Enroll in sessions, attend courses, submit feedback |

---

## 📊 Project Status & Timeline

- [x] Analysis & Design (1 week)
- [ ] Backend Development (2 weeks)
- [ ] Frontend Development (2 weeks)
- [ ] Testing & Integration (0.5 week)
- [ ] Documentation (0.5 week)

---

## 📁 Project Structure

```text
MySkills/
├── docs/                # Documentation, diagrams, specifications
│   ├── Glassmorphism_Navigation_Features.md
│   ├── Navigation_Transformation.md
│   └── specifications/
├── backend/             # Laravel 12 REST API
│   ├── app/             # Models, Controllers, Services, Enums
│   ├── config/          # Laravel config files
│   ├── database/        # SQLite DB, migrations, seeders, factories
│   ├── public/          # Public assets
│   ├── resources/       # Views, CSS, JS
│   ├── routes/          # API & web routes
│   ├── tests/           # Feature & Unit tests
│   ├── composer.json    # PHP dependencies
│   └── package.json     # JS build tools (Vite, Tailwind)
├── frontend/            # React 18 + Ant Design + Tailwind
│   ├── public/          # Static assets
│   ├── src/             # Main app code
│   │   ├── admin/       # Admin panel (Sessions, Users, Categories, Feedback, Notifications, Registrations)
│   │   ├── components/  # Shared components (Navigation, Dashboards, Modals, etc.)
│   │   ├── contexts/    # Auth, global state
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Main pages (Home, Login, Dashboard, etc.)
│   │   └── services/    # API service layer
│   ├── package.json     # Frontend dependencies
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Backend (Laravel)

1. Install PHP 8.2+, Composer, Node.js
2. `cd backend`
3. `composer install`
4. `cp .env.example .env` and configure DB (default: SQLite)
5. `php artisan migrate --seed`
6. `npm install && npm run dev` (for Vite/Tailwind)
7. `php artisan serve` (API runs on <http://localhost:8000>)

### Frontend (React)

1. Install Node.js
2. `cd frontend`
3. `npm install`
4. `npm run dev` (App runs on <http://localhost:5173>)

---

## 🔗 API Endpoints

See routes for full REST API:

- `/api/users` (CRUD, roles, profile, stats)
- `/api/categories` (CRUD, deactivate)
- `/api/training-sessions` (CRUD, filter by trainer/coordinator/category)
- `/api/training-courses` and `/api/courses` (CRUD, toggle active)
- `/api/registrations` (CRUD, approve/reject, stats)
- `/api/attendances` (CRUD)
- `/api/feedbacks` (CRUD, by session/user)
- `/api/session-completions` (CRUD, mark completed, certificates)
- `/api/notifications` (planned)
- `/api/system-health` (server, DB, storage status)

---

## 📦 Example API Request/Response

**Create a new session (POST /api/training-sessions):**

```json
{
  "category_id": 1,
  "trainer_id": 2,
  "coordinator_id": 3,
  "date": "2025-07-20",
  "start_time": "09:00",
  "end_time": "12:00",
  "location": "Room 101",
  "max_participants": 20,
  "skill_name": "Excel Basics",
  "skill_description": "Intro to Excel for business."
}
```

**Response:**

```json
{
  "id": 5,
  "category_id": 1,
  "trainer_id": 2,
  "coordinator_id": 3,
  "date": "2025-07-20",
  "start_time": "09:00",
  "end_time": "12:00",
  "location": "Room 101",
  "max_participants": 20,
  "skill_name": "Excel Basics",
  "skill_description": "Intro to Excel for business.",
  "created_at": "2025-07-18T10:00:00Z",
  "updated_at": "2025-07-18T10:00:00Z"
}
```

---

## ⚙️ Environment Variables

### Backend (.env)

- `DB_CONNECTION=sqlite` (or `mysql`)
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `APP_KEY=...`
- `APP_URL=http://localhost:8000`

### Frontend

- No custom .env required for local dev (uses Vite defaults)

---

## 🧩 Component Architecture

### User Interface Components (`src/components/`)

- **Navigation:** Responsive navbar, theme switch, notification badge, avatar dropdown
- **GlassmorphismBackground:** Animated, modern background for all pages
- **LoadingSpinner:** Reusable spinner with glassmorphism style
- **Dashboards:** TraineeDashboard, TrainerDashboard, CoordinatorDashboard (role-based)
- **SessionDetails:** Detailed session info, comments, feedback, attendance
- **Modals:** CreateCourseModal, CreateSessionModal, DeleteCourseContentModal, EditCourseContentModal, ManageCourseContentModal, UpdateSessionModal

### Admin Components (`src/admin/components/`)

- **AdminSidebar:** Navigation for admin routes
- **CRUD Modals:** For users, sessions, categories, feedback, notifications, registrations
- **Details Modals:** UserDetailsModal, SessionDetailsModal, etc.

All components are modular, reusable, and styled for a modern, accessible UI.

---

## 🧑‍💻 Development & Contribution

- Clone the repo and follow the setup steps above.
- Run backend tests: `cd backend && php artisan test`
- Run frontend lint: `cd frontend && npm run lint`
- Pull requests and issues welcome!

---

## 📚 Documentation

- Glassmorphism_Navigation_Features.md: UI/UX design details
- Navigation_Transformation.md: Navigation system evolution
- specifications: Project requirements and analysis

---

## 🧰 Used Packages & External APIs

### Backend

- **Laravel Framework**: Core backend
- **laravel/sanctum**: API authentication
- **intervention/image**: Image manipulation, certificate generation
- **fakerphp/faker**: Test data
- **phpunit/phpunit**: Testing
- **knuckleswtf/scribe**: API docs

### Frontend

- **React, Vite**: UI and build
- **Tailwind CSS, Ant Design, FontAwesome**: Styling and icons
- **Axios**: HTTP client
- **date-fns, moment**: Date/time utilities
- **react-router-dom**: Routing
- **react-player, react-youtube, yet-another-react-lightbox**: Media
- **ESLint, PostCSS, autoprefixer**: Linting and CSS tooling

### External APIs

- **Imgbb API**: Image uploads (CourseContentController, imageService)
- **Laravel Sanctum**: API tokens
- **Intervention Image**: Dynamic image/certificate generation

---

## 🚧 Limitations & TODO

- Email sending and password reset in progress
- Notifications in progress

---

## 📝 License

MIT

---

Copy and paste this content into your tempREADME.md or any README file as needed!
