# 🎓 LMS Platform — Projet d'intégration de compétences

> **Master DevOps & Cloud — M1**

Plateforme de gestion d'apprentissage en ligne (Learning Management System) construite avec une architecture microservices. Le projet intègre un portail étudiant, une gestion de cours, un tuteur IA, un service d'analytics et un système d'automatisation.

---

## 📐 Architecture

```
                          ┌──────────────────┐
                          │   Nginx Gateway  │
                          │     (port 80)    │
                          └────────┬─────────┘
            ┌──────────┬──────────┼──────────┬──────────┐
            ▼          ▼          ▼          ▼          ▼
      ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────┐
      │ Frontend ││  Course  ││   User   ││ AI Tutor ││ n8n  │
      │ Next.js  ││ Service  ││ Service  ││ Service  ││ Auto │
      │  :3000   ││ FastAPI  ││ Express  ││ FastAPI  ││:5678 │
      │          ││  :8001   ││  :8002   ││  :8004   ││      │
      └──────────┘└────┬─────┘└────┬─────┘└────┬─────┘└──┬───┘
                       │           │           │          │
                  ┌────▼────┐ ┌───▼────┐ ┌────▼────┐     │
                  │PostgreSQL│ │MongoDB │ │  Redis  │     │
                  │  :5432   │ │ :27017 │ │  :6379  │     │
                  └─────┬────┘ └────────┘ └─────────┘     │
                        │                                  │
                  ┌─────▼──────────┐                       │
                  │   Analytics    │◄──────────────────────┘
                  │   Service      │
                  │ FastAPI :8003  │
                  └────────────────┘
```

## 🧩 Services

| Service | Technologie | Port | Description |
|---------|------------|------|-------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS | `3000` | Portail étudiant avec interface moderne |
| **Course Service** | FastAPI, SQLAlchemy, PostgreSQL | `8001` | Gestion des cours, leçons et inscriptions |
| **User Service** | Node.js, Express, MongoDB | `8002` | Authentification JWT, profils utilisateurs |
| **Analytics Service** | FastAPI, SQLAlchemy, PostgreSQL | `8003` | Suivi des vues, inscriptions et tendances |
| **AI Tutor Service** | FastAPI, LLM (Llama2) | `8004` | Tuteur intelligent et aide contextuelle |
| **n8n** | n8n Automation | `5678` | Workflows d'automatisation (feedback) |
| **Nginx** | Nginx Alpine | `80` | API Gateway / Reverse proxy |

## 🛠️ Stack technique

- **Frontend** : Next.js 15 · React 19 · TypeScript · Tailwind CSS · Lucide Icons
- **Backend** : FastAPI (Python) · Express (Node.js)
- **Bases de données** : PostgreSQL 16 · MongoDB 7
- **Cache** : Redis 7
- **Automatisation** : n8n
- **Conteneurisation** : Docker · Docker Compose
- **Reverse Proxy** : Nginx

## 🚀 Démarrage rapide

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### Lancer la plateforme

```bash
# Cloner le dépôt
git clone https://github.com/<your-org>/LMS-plateform.git
cd LMS-plateform

# Démarrer tous les services
docker compose up --build -d

# Vérifier que tout fonctionne
docker compose ps
```

### Accès

| Interface | URL |
|-----------|-----|
| Portail étudiant | http://localhost |
| Course API | http://localhost:8001/docs |
| User API | http://localhost:8002 |
| Analytics API | http://localhost:8003/docs |
| AI Tutor API | http://localhost:8004/docs |
| n8n Dashboard | http://localhost:5678 |

## 📡 Points d'accès API

### Course Service (`/api/courses`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/courses/` | Lister tous les cours |
| `GET` | `/api/courses/{id}` | Détail d'un cours |
| `POST` | `/api/courses/` | Créer un cours |
| `PUT` | `/api/courses/{id}` | Modifier un cours |
| `DELETE` | `/api/courses/{id}` | Supprimer un cours |

### User Service (`/api/users`, `/api/auth`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `GET` | `/api/users/profile` | Profil utilisateur |
| `PUT` | `/api/users/profile` | Modifier le profil |

### Analytics Service (`/api/analytics`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/analytics/events/` | Enregistrer un événement |
| `GET` | `/api/analytics/events/` | Lister les événements (filtres : `event_type`, `user_id`) |
| `GET` | `/api/analytics/dashboard/` | Tableau de bord (vues, inscriptions, tendances) |

### AI Tutor Service (`/api/ai`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/ai/chat` | Envoyer un message au tuteur |
| `GET` | `/api/ai/history` | Historique des conversations |

### Health Checks

Chaque service expose un endpoint `/health` pour la vérification de santé.

## 🗄️ Schémas de base de données

### PostgreSQL — `lms_courses`

- **courses** : id, title, description, instructor, duration_hours, level, category, price, created_at
- **lessons** : id, course_id, title, content, video_url, order_index, duration_minutes
- **enrollments** : id, user_id, course_id, enrolled_at, status
- **progress** : id, enrollment_id, lesson_id, completed, completed_at
- **reviews** : id, user_id, course_id, rating, comment, created_at
- **analytics_events** : id, event_type, user_id, course_id, metadata, created_at

### MongoDB — `lms_users`

- **users** : name, email, password (hashed), role, avatar, enrolledCourses, createdAt
- **feedbacks** : userId, courseId, type, message, rating, status, createdAt

## 💻 Développement

### Lancer un service individuellement

```bash
# Exemple : Course Service
cd services/course-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Exemple : User Service
cd services/user-service
npm install
npm run dev
```

### Variables d'environnement

| Variable | Service | Description |
|----------|---------|-------------|
| `DATABASE_URL` | course, analytics, ai-tutor | URL PostgreSQL |
| `MONGODB_URI` | user-service | URL MongoDB |
| `REDIS_URL` | course, user, analytics, ai-tutor | URL Redis |
| `JWT_SECRET` | user-service | Clé secrète JWT |
| `LLM_MODEL` | ai-tutor | Modèle LLM à utiliser |

### Arrêter la plateforme

```bash
docker compose down           # Arrêter les conteneurs
docker compose down -v        # Arrêter et supprimer les volumes
```

---

> Développé dans le cadre du **Master DevOps & Cloud — M1** • Projet d'intégration de compétences