# Exercise 1.8 - The Project: Step 5

## Description

This exercise updates the Todo application to use a Kubernetes Ingress instead of a NodePort Service for external access.

The application is deployed on Kubernetes using:

* Deployment
* ClusterIP Service
* Ingress

## Changes

* Replaced the NodePort Service with a ClusterIP Service.
* Added an Ingress resource to expose the application externally.
* Updated the application to use Koa.
* Configured the application to return the Todo App page through the Ingress.

## Build the Docker Image

```bash
docker build -t todo-app:v2 .
```

## Import the Image into k3d

```bash
k3d image import todo-app:v2 -c k3s-default
```

## Deploy

```bash
kubectl apply -f manifests
```

## Verify

```bash
kubectl get deployments
kubectl get pods
kubectl get svc
kubectl get ingress
```

## Access

After the Ingress is created, open the application using the port mapped to the k3d load balancer (for example, `http://localhost:8081`).
