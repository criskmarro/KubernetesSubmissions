# Exercise 1.6

This repository contains the solution for **Exercise 1.6** of the Kubernetes course.

## Description

The application is deployed to a local Kubernetes cluster using **k3d** and **kubectl**.

The project includes:

* Kubernetes Deployment
* Kubernetes Service
* Node.js application

## Requirements

* Docker
* k3d
* kubectl

## Deploy

Apply the Kubernetes manifests:

```bash
kubectl apply -f manifests/deployment.yaml
kubectl apply -f manifests/service.yaml
```

Verify the resources:

```bash
kubectl get pods
kubectl get services
```

If using port-forward:

```bash
kubectl port-forward service/<service-name> 8080:80
```
