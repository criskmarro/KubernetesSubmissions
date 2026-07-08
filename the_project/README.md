# Exercise 2.2 – The Project, Step 8

This exercise separates the Todo application into two independent services communicating over HTTP inside the Kubernetes cluster.

## Architecture

```
Browser
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
   ├── GET /todos
   └── POST /todos
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
- Persistent cached image
- Server-side rendered HTML
- HTTP client using Axios

### Todo Backend

- Express REST API
- In-memory todo storage
- GET /todos
- POST /todos

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
docker build -t todo-app:v2 .
k3d image import todo-app:v2 -c k3s-default
```

### Todo Backend

```bash
docker build -t todo-backend:v1 .
k3d image import todo-backend:v1 -c k3s-default
```

## Deploy

```bash
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