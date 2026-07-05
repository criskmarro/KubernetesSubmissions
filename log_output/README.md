# Exercise 1.11 - Persisting Data

## Description

This exercise extends the previous applications by introducing persistent storage shared between the **Ping Pong** and **Log Output** applications.

A PersistentVolume (PV) and PersistentVolumeClaim (PVC) were created so both applications can access the same storage.

## Architecture

- **Ping Pong**
  - Receives requests at `/pingpong`
  - Increments an in-memory counter
  - Stores the current counter value in a shared file (`pingpong.txt`)

- **Log Output**
  - Consists of two containers in a single Pod:
    - **Writer**
      - Generates a random string on startup.
      - Writes the current timestamp and random string to `output.txt` every 5 seconds.
    - **Reader**
      - Reads both `output.txt` and `pingpong.txt`.
      - Displays the latest timestamp, random string and current Ping/Pong counter.

## Persistent Storage

The applications share a PersistentVolume mounted at:


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
