# Ping Pong (GKE)

This exercise deploys the **Ping Pong** application to **Google Kubernetes Engine (GKE)**.

Unlike the previous local exercises that used an Ingress with k3d, this deployment exposes the application through a Kubernetes **LoadBalancer** Service.

## Description

The application exposes a single endpoint:

```http
GET /pingpong
```

Each request increments a counter stored in a PostgreSQL database and returns the current value.

Example:

```text
pong 1
pong 2
pong 3
```

Because the counter is stored in PostgreSQL, the value survives Pod restarts.

---

## Architecture

```text
Gateway API
     │
     ▼
HTTPRoute
     │
     ▼
Argo Rollout (Canary)
     │
     ▼
Ping Pong Pods
     │
     ▼
PostgreSQL Service
     │
     ▼
PostgreSQL StatefulSet

---

## Kubernetes Resources

The deployment uses:

- Namespace
- Deployment
- LoadBalancer Service
- PostgreSQL StatefulSet
- PostgreSQL Service
- ConfigMap
- Secret
- Rollout (Argo Rollouts)
- AnalysisTemplate

---

## Build

```bash
docker build -t ping-pong:GKE .
```

---

## Push Image to Artifact Registry

```bash
docker tag ping-pong:GKE us-east1-docker.pkg.dev/<PROJECT_ID>/kubernetes/ping-pong:GKE

docker push us-east1-docker.pkg.dev/<PROJECT_ID>/kubernetes/ping-pong:GKE
```

---

## Deploy

```bash
kubectl apply -f postgres/

kubectl apply -f manifests/
```

---

## Verify

```bash
kubectl get pods

kubectl get svc

kubectl get statefulsets
```

Wait until the LoadBalancer receives an external IP:

```bash
kubectl get svc --watch
```

---

## Access

```text
http://<EXTERNAL-IP>/pingpong
```

---

## Exercise

Implemented:

- **3.1 – Ping Pong GKE**
- **4.1 – Readiness Probes**
- **4.2 – Liveness Probes**
- **4.4 – Canary Deployment with Argo Rollouts**