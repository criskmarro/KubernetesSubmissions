# Log Output

This application is part of the **DevOps with Kubernetes** course.

## Description

The Log Output application consists of two containers running inside the same Pod:

- **Writer**: generates a random string on startup and appends a timestamped log entry to a shared file every five seconds.
- **Reader**: reads the latest log file, retrieves the current ping count from the Ping Pong application through HTTP, and exposes the information through an HTTP endpoint.

## Architecture

```
                    ConfigMap
            ┌────────────────────┐
            │ information.txt    │
            │ MESSAGE            │
            └─────────┬──────────┘
                      │
           Mounted as volume + Env Variable
                      │
            ┌─────────▼─────────┐
            │   Log Reader      │
            │-------------------│
            │ Reads output.txt  │
            │ Reads config file │
            │ Reads env var     │
            │ HTTP GET /pings   │
            └─────────▲─────────┘
                      │
              Shared emptyDir
                      │
            ┌─────────▼─────────┐
            │   Log Writer      │
            │-------------------│
            │ Generates logs    │
            └───────────────────┘
                      │
                      ▼
             Ping Pong Service
                      │
                      ▼
            PostgreSQL StatefulSet
                      │
                      ▼
             Persistent Volume
```

## Features

- Generates a random identifier at startup.
- Writes a timestamped log every five seconds.
- Shares data between containers using an `emptyDir` volume.
- Retrieves the ping counter through HTTP from the Ping Pong application.
- The Ping Pong application persists the counter in PostgreSQL.
- PostgreSQL runs as a Kubernetes StatefulSet with persistent storage.
- Uses a Kubernetes ConfigMap.
- Reads configuration from:
  - an environment variable (`MESSAGE`)
  - a mounted file (`information.txt`)

## Kubernetes Resources

- Deployment
- Service
- Ingress
- ConfigMap
- StatefulSet (PostgreSQL)
- Headless Service
- PersistentVolumeClaim (dynamic provisioning)

Namespace:

```
exercises
```
## Exercises

Implemented:

- **2.5 – Documentation and ConfigMaps**
- **2.7 – Stateful Applications**