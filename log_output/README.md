# Log Output

This application is part of the **DevOps with Kubernetes** course.

## Description

The Log Output application consists of two containers running inside the same Pod:

- **Writer**: generates a random string on startup and appends a timestamped log entry to a shared file every five seconds.
- **Reader**: reads the latest log entry, retrieves the current ping count from the Ping Pong application through HTTP, and exposes the information through an HTTP endpoint.

The application is deployed to **Google Kubernetes Engine (GKE)** and exposed through the **Gateway API**, sharing the same Gateway with the Ping Pong application.

The Gateway API uses **URL rewriting**, allowing the Ping Pong application to expose its functionality at its root path (`/`) while still being available externally at `/pingpong`.

## Architecture

```text
                    ConfigMap
            ┌────────────────────┐
            │ information.txt    │
            │ MESSAGE            │
            └─────────┬──────────┘
                      │
           Mounted as volume + Env Variable
                      │
            ┌─────────▼─────────┐
            │    Log Reader     │
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
            │    Log Writer     │
            │-------------------│
            │ Generates logs    │
            └───────────────────┘
                      │
                      ▼
         Gateway API (HTTPRoute)
         URL Rewrite: /pingpong → /
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

- Generates a random identifier on startup.
- Writes a timestamped log entry every five seconds.
- Shares data between containers using an `emptyDir` volume.
- Retrieves the current ping counter from the Ping Pong application over HTTP.
- Displays the latest generated log together with the current ping count.
- Uses a Kubernetes ConfigMap for configuration.
- Reads configuration from:
  - an environment variable (`MESSAGE`)
  - a mounted file (`information.txt`)
- The Ping Pong application stores its counter in a PostgreSQL database running as a StatefulSet with persistent storage.
- Uses the Kubernetes Gateway API for external HTTP routing.
- Uses Gateway API URL rewriting so the Ping Pong application can expose its API at `/` while remaining accessible externally through `/pingpong`.

## Kubernetes Resources

- Deployment
- ClusterIP Service
- Gateway
- HTTPRoute
- ConfigMap
- PostgreSQL StatefulSet
- Headless Service
- PersistentVolumeClaim (dynamic provisioning)

Namespace:

```text
exercises
```

## Exercises

Implemented:

- **2.5 – Documentation and ConfigMaps**
- **2.7 – Stateful Applications**
- **3.2 – Back to Ingress**
- **3.3 – To the Gateway**
- **3.4 – Rewritten Routing**