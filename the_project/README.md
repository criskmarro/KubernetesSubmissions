# Exercise 1.12 - The Project, Step 6

## Description

This exercise extends the Todo application by adding support for displaying a random image from Lorem Picsum.

Instead of downloading a new image on every request, the application caches the downloaded image for 10 minutes using a PersistentVolume. This allows the image to survive Pod restarts while reducing unnecessary requests to the external API.

## Features

- Displays a random image from https://picsum.photos/1200.
- Downloads a new image only if:
  - No cached image exists.
  - The cached image is older than 10 minutes.
- Stores both the image and its metadata inside a PersistentVolume.
- Serves the cached image through the application.
- Maintains a clean separation between image management logic and HTTP routes.

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

## Persistent Storage

The application mounts a PersistentVolume at:

```
/usr/src/app/files
```

Stored files:

- image.jpg
- metadata.json

The metadata file contains the timestamp of the last downloaded image, allowing the application to determine when a new image should be fetched.

## Cache Logic

1. User requests the Todo application.
2. The application checks whether an image already exists.
3. If no image exists, a new one is downloaded.
4. If the cached image is older than 10 minutes, a new image replaces it.
5. Otherwise, the cached image is served directly from the PersistentVolume.

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

## Result

The application displays:

- A centered title.
- A cached random image.
- The text:

```
DevOps with Kubernetes 2026
```

The image remains the same for up to 10 minutes, even if the Pod restarts, thanks to persistent storage.