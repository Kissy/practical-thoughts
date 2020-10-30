---
title: "Containers best practices"
date: 2020-05-10T00:00:00+02:00
draft: false
enableToc: true
---

A curated checklist of best practices and security requirements to help running
container in production.

<!--more--> 

## 1. Applications configuration

The first part is focused on good practices to write container-ready application.

### 1.1 Expose a liveness probe

The liveness probe should always return success to indicate the application is running.[^1]
Third party services like database or REST APIs are not monitored in the liveness probe but are handled in the readiness probe.   
  
_Slow starting application are handled using startup period delay mechanism._

### 1.2 Expose a readiness probe

The readiness probe monitor required third party services and indicate if the application is able to process requests or note.
A failing dependent service must not crash the application, but mark the readiness probe as down and periodically retries checking the failing service.[^2]  
  
_Readiness and liveness probes should be different.[^3]_

### 1.3 Crash on fatal error

Unrecoverable errors must led to application crash and exit the process.
Do not use liveness probe to signal crashing application.

### 1.4 Efficient centralised logging

The best practice is _passive logging_ where the application is unaware of the logging infrastructure and write logs to `stdout` and `stderr`.[^4]
The infrastructure will be in charge of forwarding the logs to an external service.  
  
The second option is _active logging_ where the application directly sends logs into a logs aggregator service. 

### 1.5 Work in a load balanced environment

All applications must be deployed more than once to increase fault tolerance.

### 1.6 Avoid writing state in local filesystem

Prefer using external services like database or external filesystem.  
If filesystem access is required, follow the container best practice using persistent volume.

## 2. Images configuration

The second part tackle the container image build & best practice.

### 2.1 Images must externalise configuration

Non-sensitive configuration must be stored externally to handle multiple environment without having to rebuild an image.

### 2.2 Separate sensitive configuration

Sensitive configuration must be stored externally and separate from non-sensitive configuration.  
_Mount sensitive configuration into volume and do not use Environment Variables._

### 2.3 Base images should be verified and reviewed

Ensure that the container image is written either from scratch or is based on another established and trusted base image downloaded over a secure channel.[^5]

### 2.4 Process must run with a dedicated user

Dockerfile must contain the `USER username` instruction.[^5]

### 2.5 Images must run a single process

If a service requires multiple process use container linking or the sidecar pattern.[^5]

### 2.6 Installed package must be the minimal required

Do not install anything that does not justify the purpose of container.

### 2.7 Images must be rebuilt to include security patches

Evaluate available security patches and rebuilt all images impacted.[^5]

### 2.8 Run at least JRE 11+

Container support has been improved at JRE version 11 and above.

### 2.9 Configure JVM flags

Use the following JVM flags when running Java inside a container:  
`-XX:+UseContainerSupport -XX:MaxRAMPercentage=X -XX:MaxRAMPercentage=X -XX:InitialRAMPercentage=X -XX:+UseG1GC -XshowSettings:vm`.
  
_Configure specific options using the dedicated `JAVA_TOOL_OPTIONS` environment varaible._

## 3. Containers configuration

Once our application and our image are well-tailored, the runtime is the last important part.

### 3.1 Configure memory limits 

Use host resource management capabilities to control containers memory usage.

### 3.2 Containers must have CPU priority

Use host resource management capabilities to control containers resource usage.

### 3.3 Containers must not use `privileged` mode

Giving container only restricted access to resources on the host system to increase security.[^5] 

### 3.4 Containers must run with right capabilities

Docker gives by default the following capabilities: `AUDIT_WRITE`, `CHOWN`, `DAC_OVERRIDE`, `FOWNER`, `FSETID`, `KILL`, `MKNOD`, `NET_BIND_SERVICE`, `NET_RAW`, `SETFCAP`, `SETGID`, `SETPCAP`, `SETUID`, `SYS_CHROOT`.  
Always run a container disabling all capabilities and activating only the one required by the application.[^6]  
  
One capability that could be required is `NET_BIND_SERVICE` when the application requires to bind a port below 1024 inside a container.
_Enable this capability only when the binding port cannot be changed to a higher value._

### 3.5 Containers must run with a dedicated user

Running containers with unprivileged, non-root users is the best way to prevent privilege escalation attacks.

### 3.6 Store state and data outside of container

To avoid inconsistent data between instances, any persistent information should be saved in a central place outside of the container.

### 3.7 Containers may run with `read-only` filesystem

If a container is totally immutable, run the container with a read-only filesystem.

### 3.8 Limit the `on-failure` restart policy

Prevent indefinitely restarting containers by using a fixed restart policy.[^5]

### 3.9 Containers should have metadata

Business, technical & security labels will help querying monitoring tools for troubleshooting and analysis.
Recommended labels:

Name          | Description           | Example |
--------------|----------------------------------------------------------------------------------------|-------------|
Application   | The name of the application                                                            |postgres     |
Instance      | A unique ID identifying the instance of an application                                 |postgres-xyz |
Version       | The current version of the application (e.g., a semantic version, revision hash, etc.) |12.4         |
Component     | The component within the architecture                                                  |database     |
Stack         | The name of the higher business application                                            |checkout     |
Managed       | The tool being used to deploy or manage the application                                |helm         |
Owner         | The team owning the application                                                        |ecommerce    |
Data Category | Data confidentiality level                                                              |sensitive    |
Compliance    | Specific compliance requirements                                                        |pci-store    |

[^1]: [Setting up health checks with readiness and liveness probes](https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-setting-up-health-checks-with-readiness-and-liveness-probes)
[^2]: [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
[^3]: [Shooting Yourself in the Foot with Readiness Probes](https://blog.colinbreck.com/kubernetes-liveness-and-readiness-probes-how-to-avoid-shooting-yourself-in-the-foot/#shootingyourselfinthefootwithreadinessprobes)
[^4]: [The Twelve-Factor App — XI. Logs](https://12factor.net/logs)
[^5]: [CIS Docker Community Edition Benchmark](https://www.cisecurity.org/benchmark/docker/)
[^6]: [Secure Your Containers with this One Weird Trick](https://www.redhat.com/en/blog/secure-your-containers-one-weird-trick)