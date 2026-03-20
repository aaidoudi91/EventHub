# EventHub — Event & Participant Management System

EventHub is a full-stack web application for managing events, participants,
and registrations. It features role-based access control,
JWT authentication, and a complete REST API — built as part of the
Web Programming 2026 course to demonstrate relational data modeling,
multi-backend architecture, and production deployment.

## Architecture

```text
eventhub/
│
├── backend-django/
│   ├── config/
│   │   ├── settings.py          # Django configuration (DB, JWT, CORS, DRF)
│   │   ├── urls.py              # Root URL routing (API + auth + Swagger)
│   │   └── wsgi.py              # WSGI entry point (used by Gunicorn in production)
│   ├── events/
│   │   ├── migrations/          # Auto-generated database migration files
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed.py      # Database seeding command (sample data)
│   │   ├── models.py            # Event, Participant, Registration models
│   │   ├── serializers.py       # DRF serializers + business validation
│   │   ├── serializers_token.py # Custom JWT payload (adds is_staff claim)
│   │   ├── views.py             # ViewSets (CRUD for all entities)
│   │   ├── urls.py              # API router registration
│   │   ├── filters.py           # Event filtering by date and status
│   │   ├── permissions.py       # IsAdminOrReadOnly custom permission
│   │   ├── admin.py             # Django admin configuration
│   │   └── apps.py              # App configuration
│   ├── manage.py                # Django CLI entry point
│   ├── Procfile                 # Gunicorn start command for Railway
│   ├── requirements.txt         # Python dependencies
│   └── .gitignore
│
├── backend-node/
│   └── src/
│       ├── index.js             # App entry point (Express setup, DB sync, server start)
│       ├── config/
│       │   └── database.js      # Sequelize connection setup
│       ├── models/
│       │   ├── index.js         # Exports all models
│       │   ├── event.model.js   # Event model (Sequelize)
│       │   └── participant.model.js  # Participant model (Sequelize)
│       ├── routes/
│       │   ├── event.routes.js       # CRUD routes for events
│       │   └── participant.routes.js # CRUD routes for participants
│       └── middleware/
│           └── errorHandler.js  # Global error handling middleware
│
├── frontend/
│   ├── index.html               # App shell — contains the #root mount point
│   ├── vite.config.js           # Vite + Tailwind CSS plugin configuration
│   ├── eslint.config.js         # Linting rules
│   ├── vercel.json              # SPA rewrite rule (fixes 404 on page refresh)
│   └── src/
│       ├── main.jsx             # React entry point — mounts App into #root
│       ├── App.jsx              # Router, layout, and route protection setup
│       ├── index.css            # Tailwind import + global body styles
│       ├── api/
│       │   └── axios.js         # Axios instance with base URL + JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx  # Auth state, login/logout, token management
│       │   └── ThemeContext.jsx # Dark/light theme toggle, persisted in localStorage
│       ├── components/
│       │   ├── Navbar.jsx       # Top navigation bar with theme toggle
│       │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
│       │   ├── StatusBadge.jsx  # Colored badge for event status
│       │   └── Spinner.jsx      # Loading indicator
│       ├── pages/
│       │   ├── LoginPage.jsx         # Split-screen login form
│       │   ├── DashboardPage.jsx     # Stats, upcoming events, recent participants
│       │   ├── EventsPage.jsx        # Event list with filters and creation form
│       │   ├── EventDetailPage.jsx   # Event detail, edit form, registration management
│       │   └── ParticipantsPage.jsx  # Participant list with create/edit/delete
│       └── styles/
│           └── ui.js            # Centralized Tailwind class definitions (buttons, badges, inputs)
│
└── docs/
```

## Tech Stack & System Roles

### React — Frontend SPA
A Single Page Application that consumes the Django REST API.
Handles JWT token storage, role-based UI rendering (admin vs viewer),
and all CRUD interactions with loading and error state management.

| Technology      | Purpose                                    |
| --------------- | ------------------------------------------ |
| React 18        | UI — functional components and hooks       |
| Vite            | Build tool and dev server                  |
| React Router v6 | Client-side routing + route protection     |
| Axios           | HTTP client with JWT interceptor           |
| Tailwind CSS    | Utility-first styling with dark/light mode |


### Django — Main Backend
Handles all core business logic. Provides a complete REST API with JWT
authentication, role-based permissions, relational data modeling,
and input validation. This is the backend the React frontend communicates with.
Available at ```/api/``` with Swagger documentation at ```/api/docs/```.

| Technology                       | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| Django 5 + Django REST Framework | REST API and ORM                        |
| SimpleJWT                        | JWT token generation and validation     |
| drf-spectacular                  | Automatic Swagger/OpenAPI documentation |
| django-filter                    | Query filtering (date, status)          |
| WhiteNoise                       | Static file serving in production       |
| PostgreSQL / SQLite              | Production / development database       |


### Node.js / Express — Comparative Backend
A simplified parallel implementation of the API covering Events and Participants only.
Its purpose is a comparative study against Django — not used by the frontend.
Runs independently on port 3000.

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| Express    | Minimal web framework                |
| Sequelize  | ORM for model definition and queries |
| PostgreSQL | Database                             |

### Infrastructure

| Service | Role                                                   |
| ------- | ------------------------------------------------------ |
| Vercel  | Frontend hosting with automatic deploys from Git       |
| Railway | Django backend + Node.js backend + PostgreSQL database |


## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip, npm

### Django Backend

```bash
cd backend-django
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations and seed the database
python manage.py migrate
python manage.py seed

# Start the server
python manage.py runserver
```

API available at: http://localhost:8000
Swagger docs at: http://localhost:8000/api/docs/

### Node.js Backend
```bash
cd backend-node
npm install

# Create a .env file and fill in the values 
# (with PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
touch .env

npm run dev
```

API available at: http://localhost:3000


### React Frontend
```bash
cd frontend
npm install
npm run dev
```
App available at: http://localhost:5173

## Author

Aaron Aidoudi - M1 Distributed Artificial Intelligence, Université Paris Cité

Supervised by Prof. Alla Jammine





