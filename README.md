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
- Feedback and notifications
- Password reset and forgot password via email
- Profile management with image upload
- Responsive dashboards for each user role
- RESTful API with validation and error handling
- Admin analytics and CRUD for all resources
- Glassmorphism UI: Modern, responsive design with animated navigation and profile cards

---

## 🛠️ Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React.js 18.3, Ant Design, Tailwind CSS
- **Database**: MySQL 8.0
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
- [x] Backend Development (2 weeks)
- [x] Frontend Development (2 weeks)
- [x] Notifications and password reset features (done)
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
│       ├── Cahier_des_Charges_MySkills_old.docx
│       ├── Cahier_des_Charges_MySkills.xml
│       ├── Cahier_des_Charges_Professional.md
│       ├── cahier.md
│       └── convert_to_markdown.py
│   └── diagrams/
│       ├── class/
│       └── userCases/
├── backend/             # Laravel 12 REST API
│   ├── app/             # Models, Controllers, Services, Enums
│   ├── config/          # Laravel config files
│   ├── database/        # SQLite DB, migrations, seeders, factories
│   ├── lang/            # Localization
│   ├── public/          # Public assets
│   ├── resources/       # Views, CSS, JS
│   ├── routes/          # API & web routes
│   ├── storage/         # File storage
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

## 🗂️ Backend Models & Entities

Below is a summary of the main backend models/entities and their relationships:

### User

- Represents all users (admin, coordinator, trainer, trainee).
- Fields: id, first_name, last_name, email, password, phone, role (enum), status (enum), is_active, profile_picture, timestamps.
- Relationships: Has many Registrations, Notifications, CourseCompletions; can be a Trainer or Coordinator for TrainingSessions.

### Category

- Groups training sessions by topic/skill.
- Fields: id, name, description, is_active, timestamps.
- Relationships: Has many TrainingSessions.

### TrainingSession

- Represents a scheduled training event.
- Fields: id, category_id, coordinator_id, trainer_id, date, end_date, start_time, end_time, location, max_participants, skill_name, skill_description, status, timestamps.
- Relationships: Belongs to Category, Coordinator, Trainer; has many TrainingCourses, Registrations, Feedback, SessionCompletions.

### TrainingCourse

- A course within a session (e.g., a module or topic).
- Fields: id, training_session_id, title, description, duration_hours, created_by, is_active, timestamps.
- Relationships: Belongs to TrainingSession; has many CourseContents, CourseCompletions.

### CourseContent

- Content/material for a course (text, video, file, etc.).
- Fields: id, training_course_id, content, type (enum), timestamps.
- Relationships: Belongs to TrainingCourse.

### Registration

- Tracks a user's registration for a session.
- Fields: id, user_id, training_session_id, registered_at, status (enum), timestamps.
- Relationships: Belongs to User and TrainingSession; has one Feedback, one SessionCompletion.

### CourseCompletion

- Tracks a user's completion of a course.
- Fields: id, user_id, training_course_id, status, completed_at, timestamps.
- Relationships: Belongs to User and TrainingCourse.

### SessionCompletion

- Tracks a user's completion of a session (and certificate issuance).
- Fields: id, registration_id, training_session_id, courses_completed, total_courses, completion_notes, started_at, completed_at, certificate_issued, certificate_url, status, timestamps.
- Relationships: Belongs to Registration and TrainingSession.

### Feedback

- User feedback for a session.
- Fields: id, registration_id, training_session_id, rating, comment, timestamps.
- Relationships: Belongs to Registration and TrainingSession.

### Notification

- In-app/email notifications for users.
- Fields: id, user_id, type, title, message, data (json), priority (enum), is_read, read_at, action_url, icon, expires_at, timestamps.
- Relationships: Belongs to User.

---
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
- `/api/notifications` (CRUD, in-app/email notifications)
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

### Backend (.env)

- `DB_CONNECTION=sqlite` (or `mysql`)
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `APP_KEY=...`
- `APP_URL=http://localhost:8000`

#### Email (SMTP) Configuration

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="MySkills"
```

#### Imgbb API Configuration

```
IMAGEBB_API_KEY=your_imgbb_api_key
IMAGEBB_URL=https://api.imgbb.com/1/upload
```

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

- [**Laravel Framework**](https://laravel.com/): Core backend
- [**laravel/sanctum**](https://laravel.com/docs/12.x/sanctum): API authentication
- [**intervention/image**](https://image.intervention.io/): Image manipulation, certificate generation
- [**fakerphp/faker**](https://fakerphp.github.io/): Test data
- [**phpunit/phpunit**](https://phpunit.de/): Testing
- [**knuckleswtf/scribe**](https://scribe.knuckles.wtf/): API docs

### Frontend

- [**React**](https://react.dev/), [**Vite**](https://vitejs.dev/): UI and build
- [**Tailwind CSS**](https://tailwindcss.com/), [**Ant Design**](https://ant.design/), [**FontAwesome**](https://fontawesome.com/): Styling and icons
- [**Axios**](https://axios-http.com/): HTTP client
- [**date-fns**](https://date-fns.org/), [**moment**](https://momentjs.com/): Date/time utilities
- [**react-router-dom**](https://reactrouter.com/): Routing
- [**react-player**](https://github.com/cookpete/react-player), [**react-youtube**](https://github.com/tjallingt/react-youtube), [**yet-another-react-lightbox**](https://yet-another-react-lightbox.com/): Media
- [**ESLint**](https://eslint.org/), [**PostCSS**](https://postcss.org/), [**autoprefixer**](https://github.com/postcss/autoprefixer): Linting and CSS tooling

### External APIs

- [**Imgbb API**](https://api.imgbb.com/): Image uploads (CourseContentController, imageService)
- [**Laravel Sanctum**](https://laravel.com/docs/12.x/sanctum): API tokens
- [**Intervention Image**](https://image.intervention.io/): Dynamic image/certificate generation

---
