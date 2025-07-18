<p align="center">
  <img src="frontend/public/logos/myskills-logo-icon.png" alt="MySkills Logo" width="120" />
</p>

# MySkills - Training Management Platform

[![Laravel](https://img.shields.io/badge/Laravel-11-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://mysql.com)

## 📋 Overview

MySkills is a web-based training management platform developed for **SMART SKILLS**. The platform digitalizes the training process from course creation to attendance tracking.

**Duration**: 6 weeks (June 26 - August 6, 2025)  

## 🎯 Key Features

- **Course Management**: Create and organize training courses
- **Session Planning**: Schedule sessions and assign trainers  
- **User Registration**: Handle trainee enrollments
- **Attendance Tracking**: Monitor participation
- **Role-based Access**: Admin, Coordinator, Trainer, Trainee roles

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.1+)
- **Frontend**: React.js 18.3
- **Database**: MySQL 8.0
- **Styling**: Tailwind CSS
- **Version Control**: Git + GitHub

## 👥 User Roles

- **Admin**: Platform management, user administration
- **Coordinator**: Course creation, session planning, registration management
- **Trainer**: Session delivery, attendance management, schedule consultation
- **Trainee**: Course browsing, registration, feedback submission

## 📊 Project Status

🔧 **In Development** - Esprit Summer Internship Project 2025

### Timeline

- [x] Analysis & Design (1 week)
- [ ] Backend Development (2 weeks)
- [ ] Frontend Development (2 weeks)
- [ ] Testing & Integration (0.5 week)
- [ ] Documentation (0.5 week)

## 📁 Project Structure

```
MySkills/
├── docs/                # Documentation, diagrams, specifications
│   ├── Glassmorphism_Navigation_Features.md
│   ├── Navigation_Transformation.md
│   └── specifications/
├── backend/             # Laravel 11 REST API
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
│   │   ├── admin/       # Admin panel (Sessions, Users)
│   │   ├── components/  # Shared components
│   │   ├── contexts/    # Auth, global state
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Main pages (Home, Login, Dashboard, etc.)
│   │   └── services/    # API service layer
│   ├── package.json     # Frontend dependencies
│   └── tailwind.config.js
└── README.md
```

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

## 🔗 API Endpoints

See `backend/routes/` for full REST API:

- `/api/users` (CRUD, roles, profile, stats)
- `/api/categories` (CRUD, deactivate)
- `/api/training-sessions` (CRUD, filter by trainer/coordinator/category)
- `/api/training-courses` and `/api/courses` (CRUD, toggle active)
- `/api/registrations` (CRUD, approve/reject, stats)
- `/api/attendances` (CRUD)
- `/api/feedbacks` (CRUD, by session/user)
- `/api/session-completions` (CRUD, mark completed, certificates)
- `/api/notifications` (CRUD, unread, broadcast)
- `/api/system-health` (server, DB, storage status)

## 🖥️ Frontend Features

- **Glassmorphism UI**: Modern navigation, profile cards, responsive design
- **Admin Panel**: Dashboard, Sessions, Users, Categories
- **Session Management**: Create, update, view, delete sessions; assign trainers/coordinators; manage participants and courses
- **User Management**: Role-based access, profile, authentication
- **Attendance & Feedback**: Track attendance, submit feedback, view completion/certificates
- **Notifications**: Real-time updates, unread tracking

## 📚 Documentation

- `docs/Glassmorphism_Navigation_Features.md`: UI/UX design details
- `docs/Navigation_Transformation.md`: Navigation system evolution
- `docs/specifications/`: Project requirements and analysis

## 🧪 Testing

- Backend: PHPUnit (`phpunit.xml`, `tests/Feature`, `tests/Unit`)
- Frontend: ESLint, manual testing

## 📝 License

MIT
