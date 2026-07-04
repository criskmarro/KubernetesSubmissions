# Exercise 1.9 - More Services

## Description

This exercise introduces a second application called **Ping Pong** that runs alongside the Todo application.

Both applications are deployed in the same Kubernetes cluster and are exposed through a shared Ingress.

## Applications

### Todo App

* Displays the Todo application page.
* Exposed through the root path (`/`).

### Ping Pong

* Responds to `GET /pingpong`.
* Returns `pong <counter>`.
* Increments an in-memory counter on every request.

Example:

```text
GET /pingpong

pong 1
pong 2
pong 3
```

The counter is stored in memory, so it resets if the Pod is recreated.

## Kubernetes Resources

The project uses:

* Deployment (Todo App)
* ClusterIP Service (Todo App)
* Deployment (Ping Pong)
* ClusterIP Service (Ping Pong)
* Shared Ingress

## Build Docker Images

```bash
docker build -t todo-app:v2 ./todo-app

docker build -t ping-pong:v1 ./ping-pong
```

## Import Images into k3d

```bash
k3d image import todo-app:v2 -c k3s-default

k3d image import ping-pong:v1 -c k3s-default
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

Todo App

```text
http://localhost:8081/
```

Ping Pong

```text
http://localhost:8081/pingpong
```
