# The Project

This project is part of the **DevOps with Kubernetes** course.

## Description

The application consists of independent frontend and backend services communicating inside a Kubernetes cluster.

The frontend serves a server-side rendered user interface with a cached image, while the backend exposes a REST API for managing todos stored in a PostgreSQL database.

Besides the traditional HTTP communication, the application also follows an event-driven architecture using **NATS**. Whenever a todo is created or completed, the backend publishes an event that is consumed by an independent broadcaster service responsible for forwarding notifications to an external webhook.

The application demonstrates production-oriented Kubernetes features including persistent storage, health probes, self-healing, messaging, scheduled jobs, resource management, continuous deployment, and canary deployments.

The production deployment targets **Google Kubernetes Engine (GKE)** using **Gateway API**, **Kustomize**, **Google Artifact Registry**, and **GitHub Actions**. Kubernetes configuration is maintained separately in the [kubernetes-project-config](https://github.com/criskmarro/kubernetes-project-config) repository and synchronized by Argo CD.

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
                 │ Todo management UI         │
                 └──────────────┬─────────────┘
                                │
                                ▼
                       Todo Backend API
                 ┌────────────────────────────┐
                 │ GET /todos                 │
                 │ POST /todos                │
                 │ PUT /todos/:id             │
                 └──────────────┬─────────────┘
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
             ▼                                     ▼
      PostgreSQL StatefulSet                 NATS Messaging
             │                                     │
             │                                     ▼
             │                           Broadcaster Service
             │                                     │
             ▼                                     ▼
      Persistent Storage                 Generic Webhook / Chat Service

      Hourly CronJob                     Daily Backup CronJob
             │                                   │
             ▼                                   ▼
     Random Wikipedia Page                 pg_dump Database
             │                                   │
             ▼                                   ▼
      Create Reading Todo             Google Cloud Storage
```

---

# Components

## Todo App

- Express server
- Server-side rendered HTML
- Cached Lorem Picsum image
- Axios HTTP client
- Mark todos as completed
- Image cache stored on a PersistentVolumeClaim

## Todo Backend

- Koa REST API
- PostgreSQL client
- Automatic database initialization
- Request logging
- 140-character validation
- GET /todos
- POST /todos
- PUT /todos/:id
- Publishes NATS events after successful database updates

Published events:

- `todo.created`
- `todo.completed`

---

## Broadcaster

The broadcaster is an independent microservice responsible for forwarding todo events to external services.

Features:

- Subscribes to NATS queue subscriptions
- Receives todo lifecycle events
- Sends webhook notifications
- Horizontally scalable
- Queue-based message consumption avoids duplicate notifications

Current deployment:

- 6 replicas

Using a NATS queue group guarantees that every event is processed exactly once by a single broadcaster replica.

Example webhook payload:

```json
{
  "user": "todo-bot",
  "message": "Todo completed: Learn Kubernetes"
}
```

The webhook endpoint is configured through the `WEBHOOK_URL` environment variable.

---

## NATS

Used as the internal messaging system.

Responsibilities:

- Decouples services
- Event-driven communication
- Queue subscriptions
- Horizontal scalability
- At-most-once delivery (Core NATS)

---

## PostgreSQL

- StatefulSet
- Headless Service
- Persistent storage
- ConfigMap + Secret configuration

---

## Todo Reminder CronJob

Runs every hour.

1. Fetches a random Wikipedia article.
2. Creates a reading reminder todo.

---

## PostgreSQL Backup CronJob

Runs every 24 hours.

- Executes pg_dump
- Uploads timestamped backups to Google Cloud Storage.

---

# Features

- Gateway API
- REST API
- Event-driven architecture
- NATS messaging
- Queue subscriptions
- Horizontally scalable broadcaster
- Webhook notifications
- PostgreSQL StatefulSet
- Persistent image cache
- Persistent database storage
- Todo completion
- Daily PostgreSQL backups
- Hourly reminder CronJob
- Google Cloud Storage integration
- ConfigMaps
- Secrets
- PersistentVolumeClaims
- Readiness probes
- Liveness probes
- Automatic self-healing
- Canary deployments
- Kustomize
- Google Artifact Registry
- GitHub Actions CI/CD
- Resource requests and limits

---

# Continuous Deployment

GitHub Actions automatically:

- Builds every application image
- Pushes images to Google Artifact Registry
- Updates image references with Kustomize
- Deploys to Google Kubernetes Engine
- Waits for successful rollouts
- Deploys the `main` branch to the `project` namespace
- Creates preview environments for feature branches
- Cleans up preview environments automatically

---

# Storage

## Image Cache

Images are stored inside a PersistentVolumeClaim.

```
todo-images-claim
```

## Database

Todos are stored inside PostgreSQL using persistent storage.

## Backups

Daily PostgreSQL backups are uploaded to Google Cloud Storage.

---

# Resource Management

Resource requests and limits are configured for:

- Todo App
- Todo Backend
- Broadcaster
- PostgreSQL
- Todo Reminder CronJob
- PostgreSQL Backup CronJob

Monitor usage with:

```bash
kubectl top pods -n project
```

---

## 4.10. The project, the grande finale

This milestone completes the separation between the application code repository and the Kubernetes configuration repository.

The workflow now keeps the code in the application repository, while the configuration repository stores the Kustomize files, manifests, and Argo CD application definition.

This enables a clean GitOps flow where:

- the application repository contains the source code and build workflow,
- the configuration repository holds deployment definitions,
- GitHub Actions updates the configuration repository,
- Argo CD synchronizes the deployment from the configuration repository.

# Health Checks

The application implements Kubernetes health probes.

## Readiness Probe

Pods receive traffic only when:

- initialized;
- connected to PostgreSQL;
- ready to process requests.

## Liveness Probe

Automatically restarts unhealthy Pods.

---

# Self-healing

The UI includes a **Break the app** button.

When triggered:

1. The application reports itself as unhealthy.
2. The liveness probe fails.
3. Kubernetes restarts the Pod.
4. Traffic is restored automatically.

---

# Todo Management

Supported operations:

- Create todos
- List todos
- Mark todos as completed

Completed todos are displayed with:

- strikethrough text
- reduced opacity
- Done badge

---

# Kubernetes Resources

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
- NATS
- Resource requests and limits
- Readiness Probes
- Liveness Probes

---

# Exercises

Implemented:

- **2.9 – The project, step 12**
- **2.10 – The project, step 13**
- **3.5 – The project, step 14**
- **3.6 – The project, step 15**
- **3.7 – The project, step 16**
- **3.8 – The project, step 17**
- **3.9 – DBaaS vs DIY**
- **3.10 – The project, step 19**
- **3.11 – Resource Management**
- **3.12 – The project, step 20**
- **4.2 – The project, step 21**
- **4.5 – The project, step 22**
- **4.6 – The project, step 23**
