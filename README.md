# EventHub - Event & Participant Management System

EventHub is a full-stack web application for managing events, participants, and registrations. 
It features role-based access control, JWT authentication, and a complete REST API. Built as part of the Web Programming
course to demonstrate relational data modeling, multi-backend architecture, and production deployment.


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
│   ├── index.html               # App shell, contains the #root mount point
│   ├── vite.config.js           # Vite + Tailwind CSS plugin configuration
│   ├── eslint.config.js         # Linting rules
│   ├── vercel.json              # SPA rewrite rule (fixes 404 on page refresh)
│   └── src/
│       ├── main.jsx             # React entry point, mounts App into #root
│       ├── App.jsx              # Router, layout, and route protection setup
│       ├── index.css            # Tailwind import + global body styles
│       ├── api/
│       │   └── axios.js         # Axios instance with base URL + JWT interceptor
│       ├── context/
│       │   ├── AuthContext.jsx   # Auth state, login/logout, token management
│       │   └── ThemeContext.jsx  # Dark/light theme toggle, persisted in localStorage
│       ├── components/
│       │   ├── Navbar.jsx            # Top navigation bar with theme toggle
│       │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
│       │   ├── StatusBadge.jsx       # Colored badge for event status
│       │   ├── Spinner.jsx           # Loading indicator
│       │   └── ConfirmModal.jsx      # Confirmation dialog box
│       ├── pages/
│       │   ├── LoginPage.jsx         # Split-screen login form
│       │   ├── DashboardPage.jsx     # Stats, upcoming events, recent participants
│       │   ├── EventsPage.jsx        # Event list with filters and creation form
│       │   ├── EventDetailPage.jsx   # Event detail, edit form, registration management
│       │   └── ParticipantsPage.jsx  # Participant list with create/edit/delete
│       └── styles/
│           └── ui.js            # Centralized Tailwind class definitions (buttons, badges, inputs)
└── 
```

## Tech Stack & System Roles

### React - Frontend SPA
A Single Page Application that consumes the Django REST API. Handles JWT token storage, role-based UI rendering (admin 
vs viewer), and all CRUD interactions with loading and error state management.

| Technology      | Purpose                                   |
| --------------- |-------------------------------------------|
| React 18        | UI, functional components and hooks       |
| Vite            | Build tool and dev server                 |
| React Router v6 | Client-side routing + route protection    |
| Axios           | HTTP client with JWT interceptor          |
| Tailwind CSS    | Utility-first styling with dark/light mode |


### Django - Main Backend
Handles all core business logic. Provides a complete REST API with JWT authentication, role-based permissions, 
relational data modeling, and input validation. This is the backend the React frontend communicates with.
Available at ```/api/``` with Swagger documentation at ```/api/docs/```.

| Technology                       | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| Django 5 + Django REST Framework | REST API and ORM                        |
| SimpleJWT                        | JWT token generation and validation     |
| drf-spectacular                  | Automatic Swagger/OpenAPI documentation |
| django-filter                    | Query filtering (date, status)          |
| WhiteNoise                       | Static file serving in production       |
| PostgreSQL / SQLite              | Production / development database       |


### Node.js / Express - Comparative Backend
A simplified parallel implementation of the API covering Events and Participants only. Its purpose is a comparative 
study against Django, not used by the frontend. Runs independently on port 3000.

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| Express    | Minimal web framework                |
| Sequelize  | ORM for model definition and queries |
| PostgreSQL | Database                             |

### Infrastructure
| Service | Role |
| ------- | ---- |
| Vercel | Frontend hosting with automatic deploys from Git |
| Railway | Django backend + Node.js backend + PostgreSQL database (web course deployment) |
| Google Kubernetes Engine | 3-node `e2-medium` cluster in `europe-west1-b` (distributed course deployment) |
| Docker Hub | Multi-architecture image registry (`amd64` + `arm64`) |
| Istio | Service mesh — mTLS encryption and AuthorizationPolicy |
| Ingress NGINX | Single entry point, path-based routing to microservices |

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip, npm

### Django Backend
```bash
cd backend-django
source venv/bin/activate  # Windows: venv\Scripts\activate
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

### Demo Credentials
To test the application's role-based access control (both on the live URL and locally after running `seed.py`), you can 
use the following pre-configured accounts:

| Role | Username | Password    | Permissions       |
| :--- | :--- |:------------|:------------------|
| **Admin** | `admin` | `admin123`  | Full access       |
| **Viewer** | `viewer` | `viewer123` | Read-only access  |

## Distributed Deployment (Kubernetes)
This project was extended as part of the Distributed Programming course to demonstrate
a microservices architecture deployed on Kubernetes.

### What was added
- **Dockerfiles** for both backends, with multi-architecture builds (`linux/amd64` + `linux/arm64`)  
  Images published on Docker Hub: [hub.docker.com/u/aaidoudi](https://hub.docker.com/u/aaidoudi)
- **Docker Compose** for local orchestration of the full stack (PostgreSQL + Django + Node.js)
- **Kubernetes manifests** (`k8s/`) covering:
  - PostgreSQL StatefulSet with PersistentVolumeClaim (1Gi)
  - Django and Node.js Deployments with initContainer for migrations
  - ClusterIP Services with Istio-compatible port naming
  - Ingress NGINX gateway routing `/api/auth`, `/api/events`, `/api/registrations`, `/api/docs` to Django, and `/api/participants` to Node.js
  - Kubernetes Secrets and ConfigMap for environment injection
  - RBAC: dedicated ServiceAccount, Role and RoleBinding per service (least privilege)
  - Istio mTLS (PERMISSIVE mode) + AuthorizationPolicy restricting PostgreSQL access to Django and Node.js only
- **GKE deployment** on a 3-node `e2-medium` cluster in `europe-west1-b`

### Architecture

```
├── k8s/
│   ├── secret.yaml              # Base64-encoded credentials (DB password, Django secret key, JWT secret)
│   ├── configmap.yaml           # Non-sensitive config (DB host/port/name, debug mode, allowed hosts)
│   ├── ingress.yaml             # NGINX Ingress gateway — routes /api/* to Django or Node.js by path prefix
│   │
│   ├── postgres/
│   │   ├── deployment.yaml     # PostgreSQL StatefulSet (stable pod identity, ordered restarts)
│   │   ├── service.yaml         # Headless ClusterIP service — port named tcp-postgres for Istio protocol detection
│   │   └── pvc.yaml             # PersistentVolumeClaim (1Gi, ReadWriteOnce) — survives pod restarts
│   │
│   ├── django/
│   │   ├── deployment.yaml      # Django Deployment — initContainer runs migrations + seed before app starts
│   │   └── service.yaml         # ClusterIP service — port named http for Istio protocol detection
│   │
│   ├── node/
│   │   ├── deployment.yaml      # Node.js Deployment — JWT validated locally via shared secret
│   │   └── service.yaml         # ClusterIP service — port named http for Istio protocol detection
│   │
│   ├── rbac/
│   │   ├── serviceaccounts.yaml # One dedicated ServiceAccount per service (django-sa, node-sa, postgres-sa)
│   │   ├── roles.yaml           # Least-privilege Roles — read-only access to Secrets/ConfigMaps
│   │   └── rolebindings.yaml    # Binds each Role to its ServiceAccount
│   │
│   └── istio/
│       ├── mtls.yaml            # PeerAuthentication PERMISSIVE — mTLS between mesh pods, plain HTTP from Ingress
│       └── authorization-policy.yaml  # ALLOW rules — PostgreSQL restricted to django-sa and node-sa only
```

### Running on Kubernetes (Minikube)

```bash
# 1. Start Minikube and enable Ingress
minikube start
minikube addons enable ingress

# 2. Apply manifests in order
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/rbac/
kubectl apply -f k8s/postgres/
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl apply -f k8s/django/
kubectl apply -f k8s/node/
kubectl apply -f k8s/ingress.yaml

# 3. Install Istio
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
kubectl rollout restart deployment django node
kubectl rollout restart statefulset postgres
kubectl apply -f k8s/istio/

# 4. Access the API
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
# API available at http://localhost:8080
```

> For GKE deployment, see section 7 of the project report.

## Author
Aaron Aidoudi - M1 Distributed Artificial Intelligence, Université Paris Cité

Supervised by Dr. Alla Jammine
