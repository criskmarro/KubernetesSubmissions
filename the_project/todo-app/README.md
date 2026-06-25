# Todo App

A simple Node.js web server deployed to Kubernetes as part of the Full Stack Open Kubernetes exercises.

## Features

* Node.js HTTP server
* Configurable port through the `PORT` environment variable
* Dockerized application
* Kubernetes deployment using a Deployment manifest

## Running locally

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The server will start on the port specified by the `PORT` environment variable.

Example:

```bash
PORT=8080 npm start
```

## Docker

Build the image:

```bash
docker build -t todo-app:v1 .
```

Run the container:

```bash
docker run -p 8080:8080 -e PORT=8080 todo-app:v1
```

## Kubernetes

Deploy the application:

```bash
kubectl apply -f manifests/deployment.yaml
```

Check the deployment:

```bash
kubectl get deployments
kubectl get pods
```

View logs:

```bash
kubectl logs <pod-name>
```

## Course

This project was created for the Full Stack Open Kubernetes course exercises.
