# KubernetesSubmissions

## Exercises

### Chapter 2

- [1.1](https://github.com/criskmarro/KubernetesSubmissions/tree/1.1/log_output)
- [1.2](https://github.com/criskmarro/KubernetesSubmissions/tree/1.2/the_project/todo-app)
- [1.3](https://github.com/criskmarro/KubernetesSubmissions/tree/1.3/log_output)
- [1.4](https://github.com/criskmarro/KubernetesSubmissions/tree/1.4/the_project/todo-app)
- [1.5](https://github.com/criskmarro/KubernetesSubmissions/tree/1.5/the_project/todo-app)
- [1.6](https://github.com/criskmarro/KubernetesSubmissions/tree/1.6/1.6)
- [1.7](https://github.com/criskmarro/KubernetesSubmissions/tree/1.7/log_output)
- [1.8](https://github.com/criskmarro/KubernetesSubmissions/tree/1.8/the_project/todo-app)
- [1.9](https://github.com/criskmarro/KubernetesSubmissions/tree/1.9/ping-pong)
- [1.10](https://github.com/criskmarro/KubernetesSubmissions/tree/1.10/log_output)
- [1.11](https://github.com/criskmarro/KubernetesSubmissions/tree/1.11/)
- [1.12](https://github.com/criskmarro/KubernetesSubmissions/tree/1.12/the_project)
- [1.13](https://github.com/criskmarro/KubernetesSubmissions/tree/1.13/the_project)

### Chapter 3

- [2.1](https://github.com/criskmarro/KubernetesSubmissions/tree/2.1/log_output)
- [2.2](https://github.com/criskmarro/KubernetesSubmissions/tree/2.2/the_project)
- [2.3](https://github.com/criskmarro/KubernetesSubmissions/tree/2.3/log_output)
- [2.4](https://github.com/criskmarro/KubernetesSubmissions/tree/2.4/the_project)
- [2.5](https://github.com/criskmarro/KubernetesSubmissions/tree/2.5/log_output)
- [2.6](https://github.com/criskmarro/KubernetesSubmissions/tree/2.6/the_project)
- [2.7](https://github.com/criskmarro/KubernetesSubmissions/tree/2.7/log_output)
- [2.8](https://github.com/criskmarro/KubernetesSubmissions/tree/2.8/the_project)
- [2.9](https://github.com/criskmarro/KubernetesSubmissions/tree/2.9/the_project)
- [2.10](https://github.com/criskmarro/KubernetesSubmissions/tree/2.10/the_project)

### Chapter 4

- [3.1](https://github.com/criskmarro/KubernetesSubmissions/tree/3.1/log_output/ping-pong)
- [3.2](https://github.com/criskmarro/KubernetesSubmissions/tree/3.2/log_output)
- [3.3](https://github.com/criskmarro/KubernetesSubmissions/tree/3.3/log_output)
- [3.4](https://github.com/criskmarro/KubernetesSubmissions/tree/3.4/log_output)
- [3.5](https://github.com/criskmarro/KubernetesSubmissions/tree/3.5/the_project)
- [3.6](https://github.com/criskmarro/KubernetesSubmissions/tree/3.6/the_project)
- [3.7](https://github.com/criskmarro/KubernetesSubmissions/tree/3.7/the_project)
- [3.8](https://github.com/criskmarro/KubernetesSubmissions/tree/3.8/the_project)
- [3.9](https://github.com/criskmarro/KubernetesSubmissions/tree/3.9#39-dbaas-vs-diy)
- [3.9](https://github.com/criskmarro/KubernetesSubmissions/tree/3.9#39-dbaas-vs-diy)
- [3.10](https://github.com/criskmarro/KubernetesSubmissions/tree/3.10/the_project)
- [3.11](https://github.com/criskmarro/KubernetesSubmissions/tree/3.11/the_project)
- [3.12](https://github.com/criskmarro/KubernetesSubmissions/tree/3.12/images-3.12)

### Chapter 4

- [4.1](https://github.com/criskmarro/KubernetesSubmissions/tree/4.1/log_output)



---
## 3.9 DBaaS vs DIY

Comparison between using **Google Cloud SQL** (Database as a Service) and a **self-hosted** PostgreSQL solution running inside GKE via `StatefulSet` + `PersistentVolumeClaim`.

### Initial setup

| | Cloud SQL (DBaaS) | Postgres on GKE (DIY) |
|---|---|---|
| Work required | Create the instance from the console/CLI (`gcloud sql instances create`), configure private networking (VPC peering or Cloud SQL Auth Proxy), users and databases | Write and maintain YAML manifests (`StatefulSet`, headless `Service`, `ConfigMap`, `Secret`, `PersistentVolumeClaim`), choose an image, define resources and probes |
| Time to get something working | Minutes — the instance is ready and managed with no further configuration | Similarly minutes for a simple case, but grows quickly if high availability, replicas, or tuning are needed |
| Learning curve | Low: managed from the GCP console or `gcloud`, no deep Kubernetes knowledge required | Medium/high: requires understanding `StatefulSets`, `volumeClaimTemplates`, headless `Services`, and how Postgres behaves in containers |
| Networking | Requires configuring private access (VPC-native, Private Service Connect, or Cloud SQL Auth Proxy) so GKE pods can connect securely | The Postgres pod lives in the same cluster/namespace; direct connection via internal DNS (`postgres.exercises.svc.cluster.local`), no extra network setup |

### Costs

| | Cloud SQL | Postgres on GKE |
|---|---|---|
| Billing model | Dedicated instance billed hourly (vCPU + memory) plus storage, regardless of actual usage. For example, a vCPU in a high-availability configuration costs approximately <cite index="7-1">$0.108/hour, with SSD storage at $0.222/GB per month</cite> | Only the cluster nodes' compute resources are paid for (which likely already exist to run the application), plus the PVC's `PersistentDisk`, billed the same as any GCP disk |
| Most common hidden cost | Automated backups and point-in-time recovery (PITR) are billed separately and can add up quickly: <cite index="4-1">automated backups cost approximately $0.11 per GB per month, and a 7-day retention policy on a 500GB database can accumulate up to 800GB of backup data</cite>, and <cite index="4-1">enabling PITR adds an extra 20% to 40% on top of the estimated backup volume</cite> | The "backup" (disk snapshot) also carries a storage cost, but it's more predictable since you decide the frequency and retention manually |
| Network overhead | Egress charges may apply if the app and database aren't in the same region | No egress charges if everything runs within the same cluster/VPC |
| Expected total cost | Higher in absolute terms, since on top of compute you're paying for the management layer, automatic HA, and integrated monitoring | Lower on the surface, but the "savings" hide the cost of engineering time/maintenance (see below) |

In summary: **for small or lab workloads, DIY tends to be cheaper on the direct bill**, but Cloud SQL can end up cheaper in total cost of ownership once you factor in the engineer-hours spent manually maintaining the instance.

### Maintenance

| | Cloud SQL | Postgres on GKE |
|---|---|---|
| Patches and minor version upgrades | Automatic, managed by Google in configurable maintenance windows | Manual: the container image must be updated and the rollout applied, verifying data compatibility |
| High availability / failover | Automatic failover included in the HA tier, no manual intervention | Must be implemented manually (read replicas, `Patroni`, `Stolon`, or similar solutions) — Kubernetes doesn't provide database HA for free just by running a `StatefulSet` |
| Vertical scaling | A tier change from the console or CLI, with brief downtime managed by Google | Requires editing the `StatefulSet`, considering the `PersistentVolume` size (some storage classes don't allow shrinking), and restarting the pod |
| Monitoring | Integrated with Cloud Monitoring and Query Insights out of the box | Must be instrumented manually (Prometheus exporters, dashboards, alerts) |
| Operational responsibility | Google manages the operating system, the database engine, and host-level security patches | The team is responsible for everything: container security, base image updates, engine configuration |

### Backups

| | Cloud SQL | Postgres on GKE |
|---|---|---|
| Mechanism | Automated, schedulable backups from the console/API, with configurable retention and restoration in a few clicks or a single command | Requires manual implementation: `pg_dump`/`pg_dumpall` scheduled via a `CronJob`, or snapshots of the underlying `PersistentDisk` via `VolumeSnapshot` |
| Ease of use | Very high — point-and-click or a single `gcloud sql backups create` / `gcloud sql instances restore` command | Low/medium — requires designing the strategy (logical dump vs. physical snapshot), scheduling it, testing it, and automating restoration |
| Point-in-time recovery | Available natively (with additional cost, see above) | Possible but much more laborious: requires manually configured WAL archiving (`archive_command`, external WAL storage) |
| Risk of human error | Low, automation is managed by Google | Higher — if the backup `CronJob` fails silently or the `PersistentVolume` gets corrupted without a recent snapshot, data can be lost |

### Conclusion

- **Cloud SQL (DBaaS)** is the recommended option when prioritizing delivery speed, when there's budget for the management layer, or when the team lacks experience operating databases in production. It drastically reduces maintenance and backup work in exchange for a higher hourly cost and less granular control (for example, <cite index="8-1">full superuser access isn't available like in a self-managed instance, which can restrict certain extensions and administrative operations</cite>).
- **Self-hosted on GKE (DIY)** is preferable when full control over the Postgres configuration is needed, when minimizing infrastructure cost is the priority, or when the project/exercise is for learning purposes (as is the case for this course). The real cost isn't monetary but engineering time: you have to manually build what Cloud SQL provides by default (HA, backups, monitoring, patching).

For this specific exercise, given it's a practice/learning environment with no production requirements, the DIY solution with a `PersistentVolumeClaim` is adequate and more cost-effective, but in a real environment with critical business data, Cloud SQL would be the safer default choice.