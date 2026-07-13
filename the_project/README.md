# The Project

This project is part of the DevOps with Kubernetes course.

## Description

The application is divided into two independent services that communicate over HTTP inside the Kubernetes cluster.

The frontend serves the user interface and cached image, while the backend exposes a REST API for managing todos. Todo items are now stored in a PostgreSQL database running as a Kubernetes StatefulSet.

## Architecture

```
Browser
   │
   ▼
Ingress
   │
   ▼
Todo App (Frontend)
   │
   ├── Serves HTML
   ├── Serves cached image
   └── HTTP requests
          │
          ▼
Todo Backend
   │
   ├── GET /todos
   ├── POST /todos
   └── PostgreSQL client
          │
          ▼
PostgreSQL Service
          │
          ▼
PostgreSQL StatefulSet
```

The Todo App is responsible for:

- Rendering the HTML page.
- Displaying the cached Lorem Picsum image.
- Receiving form submissions.
- Fetching todos from the backend.
- Forwarding new todos to the backend.

The Todo Backend is responsible for:

- Storing todos in memory.
- Returning the current todo list.
- Creating new todos.

## Components

### Todo App

- Express server
- Server-side rendered HTML
- Cached Lorem Picsum image
- Axios HTTP client
- Image cache stored on a Persistent Volume

## Todo Backend

- Koa REST API
- PostgreSQL client (pg)
- Automatic database initialization
- GET /todos
- POST /todos
- PostgreSQL
- StatefulSet (1 replica)
- Headless Service
- Dynamic Persistent Volume (local-path)
- Configured using ConfigMaps and Secrets

## Endpoints

### Todo App

```
GET /
GET /image
POST /todo
```

### Todo Backend

```
GET /todos
POST /todos
```

## Build

### Todo App

```bash
docker build -t todo-app:v3 .
k3d image import todo-app:v3 -c k3s-default
```

### Todo Backend

```bash
docker build -t todo-backend:v2 .
k3d image import todo-backend:v2 -c k3s-default
```

## Deploy

```bash
kubectl apply -f postgres/

kubectl apply -f todo-backend/manifests/

kubectl apply -f todo-app/manifests/

kubectl apply -f manifests/
```

or restart after rebuilding:

```bash
kubectl rollout restart deployment todo-app-deployment
kubectl rollout restart deployment todo-backend-deployment
```

## Result

The browser can:

- Display the cached image.
- View all current todos.
- Create new todos.
- See the updated list immediately after submission.

The frontend and backend communicate through Kubernetes Services instead of sharing application logic.