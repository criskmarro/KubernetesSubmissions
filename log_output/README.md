# Exercise 1.7 - External Access with Ingress

## Description

This exercise extends the **Log Output** application by exposing its current status through an HTTP endpoint and making it accessible externally using a Kubernetes Ingress.

The application:

* Generates a random string when it starts.
* Logs the current timestamp and the random string every 5 seconds.
* Returns the current timestamp and the startup random string through an HTTP endpoint.

## Kubernetes Resources

The application is deployed using:

* Deployment
* ClusterIP Service
* Ingress

## Build the Docker Image

```bash
docker build -t log-output:1.7 .
```

## Import the Image into k3d

```bash
k3d image import log-output:1.7 -c log-output
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

Once the Ingress is running, open:

```
http://localhost:8082
```

The application returns the current timestamp together with the random string generated when the application started.
