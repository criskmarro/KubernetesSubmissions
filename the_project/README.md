# Exercise 1.13 - The Project, Step 7

## Description

This exercise extends the Todo application by adding the first user interface elements required for managing todos.

The application now includes a form where users can enter new tasks, a send button, and a list displaying existing todos. At this stage, todos are stored only in memory and are intended as a visual demonstration before implementing persistent storage in future exercises.

The random image functionality introduced in Exercise 1.12 remains unchanged and continues using a PersistentVolume for caching.

---

## Features

- Displays a random image from Lorem Picsum.
- Caches the image for 10 minutes using a PersistentVolume.
- Responsive user interface.
- Input field with a maximum length of **140 characters**.
- Send button for submitting new todos.
- Dynamic todo list displayed below the form.
- Modern card-based UI with improved styling.
- Todos are temporarily stored in application memory.

---

## Project Structure

```
the_project/
│
├── manifests/
│   ├── ingress.yaml
│   ├── persistentvolume.yaml
│   └── persistentvolumeclaim.yaml
│
├── todo-app/
│   ├── manifests/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   │
│   ├── Dockerfile
│   ├── imageManager.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
```

---

## User Interface

The application now displays:

- Centered page title.
- Cached random image.
- Todo input form.
- Send button.
- Todo list inside a styled card.

Example layout:

```
TODO APP

[ Random Image ]

+--------------------------------------------+
| Enter a new todo (max 140 characters) |Send|
+--------------------------------------------+

Todos

┌──────────────────────────────────────────┐
│ Learn Kubernetes                         │
│ Finish Exercise 1.13                     │
│ Deploy Todo App                          │
└──────────────────────────────────────────┘
```

---

## Image Cache

Images are stored inside the mounted PersistentVolume:

```
/usr/src/app/files
```

Stored files:

- image.jpg
- metadata.json

The cached image is refreshed every 10 minutes.

---

## Technologies

- Node.js
- Express
- Axios
- Docker
- Kubernetes
- K3d
- PersistentVolume
- PersistentVolumeClaim
- Ingress

---

## Result

The application displays:

- A centered title.
- A cached random image.
- The text:

```
DevOps with Kubernetes 2026
```

The image remains the same for up to 10 minutes, even if the Pod restarts, thanks to persistent storage.