# Exercise 1.10 - Even More Services

## Description

This exercise refactors the **Log Output** application by splitting it into two containers running inside the same Kubernetes Pod.

The containers communicate through a shared `emptyDir` volume.

## Architecture

The Pod contains two containers:

### Log Writer

* Generates a random string when the container starts.
* Writes a new log entry every 5 seconds.
* Stores the log entries in a shared file.

### Log Reader

* Reads the shared log file.
* Exposes the file contents through an HTTP endpoint.

## Shared Volume

Both containers mount the same Kubernetes `emptyDir` volume.

```text
                +-----------------------+
                |      Kubernetes Pod   |
                |                       |
                |  +-----------------+  |
                |  |   Log Writer    |  |
                |  | writes output   |  |
                |  +--------+--------+  |
                |           |           |
                |     emptyDir Volume   |
                |           |           |
                |  +--------v--------+  |
                |  |   Log Reader    |  |
                |  | serves output   |  |
                |  +-----------------+  |
                +-----------------------+
```

## Kubernetes Resources

The application uses:

* Deployment
* ClusterIP Service
* Ingress
* emptyDir Volume

## Build Docker Images

```bash
docker build -t log-output-writer:v1 ./writer

docker build -t log-output-reader:v1 ./reader
```

## Import Images into k3d

```bash
k3d image import log-output-writer:v1 -c k3s-default

k3d image import log-output-reader:v1 -c k3s-default
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

Open the application through the configured Ingress, for example:

```text
http://localhost:8081/
```

The response displays the contents of the shared log file, which is continuously updated by the Log Writer container.
