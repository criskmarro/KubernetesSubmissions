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
          │ Calls Ping Pong   │
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
```

## Features

- Generates a random identifier at startup.
- Writes a timestamped log every five seconds.
- Shares data between containers using an `emptyDir` volume.
- Retrieves the ping counter using HTTP from the Ping Pong application.
- Uses a Kubernetes ConfigMap.
- Reads configuration from:
  - an environment variable (`MESSAGE`)
  - a mounted file (`information.txt`)

Example response:

```
file content: this text is from file
env variable: MESSAGE=hello world

2026-07-10T21:42:01.220Z: a1b2c3

Ping / Pongs: 17
```

## Kubernetes Resources

- Deployment
- Service
- Ingress
- ConfigMap

Namespace:

```
exercises
```

## Exercise

Implements:

- **2.5 – Documentation and ConfigMaps**