# The Project

This project is part of the **DevOps with Kubernetes** course.

## Description

The application consists of independent frontend and backend services communicating over HTTP inside a Kubernetes cluster.

The frontend serves the user interface and cached image, while the backend exposes a REST API for managing todos stored in a PostgreSQL database.

The application is deployed to **Google Kubernetes Engine (GKE)** using **Gateway API**, **Kustomize**, **Google Artifact Registry**, and **GitHub Actions**.

---

## Architecture

```text
                           Browser
                              │
                              ▼
                    Gateway API (GKE)
                              │
                              ▼
                     Todo App (Frontend)
               ┌────────────────────────────┐
               │ Server-side rendered HTML  │
               │ Cached Lorem Picsum image  │
               │ HTTP client                │
               └──────────────┬─────────────┘
                              │
                              ▼
                     Todo Backend API
               ┌────────────────────────────┐
               │ GET /todos                 │
               │ POST /todos                │
               │ PostgreSQL client          │
               └──────────────┬─────────────┘
                              │
                              ▼
                     PostgreSQL StatefulSet
                              │
                              ▼
                       Persistent Storage

         Hourly CronJob                 Daily Backup CronJob
               │                               │
               ▼                               ▼
      Random Wikipedia Page             pg_dump Database
               │                               │
               ▼                               ▼
       Create Reading Todo           Google Cloud Storage
```

---

## Components

### Todo App

- Express server
- Server-side rendered HTML
- Cached Lorem Picsum image
- Axios HTTP client
- Image cache stored on a PersistentVolumeClaim

### Todo Backend

- Koa REST API
- PostgreSQL client
- Automatic database initialization
- Request logging
- 140-character validation
- GET /todos
- POST /todos

### PostgreSQL

- StatefulSet
- Headless Service
- Persistent storage
- Configured through ConfigMap and Secret

### Todo Reminder CronJob

Runs every hour:

1. Requests a random Wikipedia article.
2. Reads the redirected URL.
3. Creates a new todo:

```
Read https://en.wikipedia.org/wiki/...
```

### PostgreSQL Backup CronJob

Runs once every 24 hours:

- Executes `pg_dump`
- Creates a timestamped SQL backup
- Uploads the backup to a Google Cloud Storage bucket

---

## Features

- Gateway API
- REST API
- PostgreSQL StatefulSet
- Persistent image cache
- Persistent database storage
- Daily PostgreSQL backups
- Hourly reminder CronJob
- Google Cloud Storage integration
- ConfigMaps
- Secrets
- PersistentVolumeClaims
- Kustomize
- Google Artifact Registry
- GitHub Actions CI/CD

---

## Continuous Deployment

GitHub Actions automatically:

- Builds every application image
- Pushes images to Google Artifact Registry
- Updates image references with Kustomize
- Deploys to Google Kubernetes Engine
- Waits for successful rollouts
- Deploys the `main` branch to the `project` namespace
- Creates isolated namespaces for feature branches
- Automatically deletes preview environments when branches are removed

---

## Storage

### Image Cache

The frontend stores downloaded images inside a PersistentVolumeClaim.

```
todo-images-claim
```

This allows cached images to survive Pod restarts.

### Database

PostgreSQL stores all todos on a persistent volume managed by Kubernetes.

### Backups

A daily CronJob uploads timestamped SQL backups to a Google Cloud Storage bucket.

---

## Kubernetes Resources

- Namespace
- Gateway
- HTTPRoute
- Deployments
- StatefulSet
- Services
- ConfigMaps
- Secrets
- PersistentVolumeClaims
- CronJobs

---

## Exercises

Implemented:

- **2.9 – The project, step 12**
- **2.10 – The project, step 13**
- **3.5 – The project, step 14**
- **3.6 – The project, step 15**
- **3.7 – The project, step 16**
- **3.8 – The project, step 17**
- **3.9 – The project, step 18**
- **3.10 – The project, step 19**