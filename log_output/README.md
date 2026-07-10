# Connecting Pods

This exercise updates the communication between the **Log Output** application and the **Ping-Pong** application.

## Objective

Replace the shared Persistent Volume used in Exercise 1.11 with direct HTTP communication between the applications.

The Log Output application now retrieves the current ping counter by sending an HTTP request to the Ping-Pong application instead of reading a shared file.


## Components

### Log Output

Contains two containers inside one Pod:

- **Writer**
  - Generates a random string on startup.
  - Writes the timestamp and random string into a shared `emptyDir` volume every five seconds.

- **Reader**
  - Reads the latest log entry.
  - Makes an HTTP request to the Ping-Pong service (`http://ping-pong-service/pings`).
  - Displays both values in the browser.

Example output:

2026-07-06T03:18:55.201Z: xy4wui

Ping / Pongs: 42


### Ping-Pong

Maintains an in-memory request counter.

Endpoints:

- `/pingpong`
  - Increments the counter.
  - Returns:
pong 43

- `/pings`
  - Returns only the current number of pings.
  - Used internally by the Log Output application.

Example:
42


## Kubernetes Resources

### Log Output

- Deployment
- Service
- Ingress

### Ping-Pong

- Deployment
- Service

## Changes from Exercise 1.11

- Removed PersistentVolume.
- Removed PersistentVolumeClaim.
- Removed shared storage between applications.
- Communication now happens through Kubernetes networking using ClusterIP Services.
- Log Output retrieves the counter through HTTP requests.

## Technologies

- Node.js
- Koa
- Kubernetes
- k3d
- Docker