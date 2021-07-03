---
title: "Comparison of Kubernetes security analysers"
date: 2021-07-03T00:00:00+02:00
draft: false
enableToc: true
---

Comparing open-source solution kube-score, kubeaudit and kyverno to perform
security analysis on Kubernetes resources.

<!--more--> 

## 1. Installation

All tools are available on Github:
* [kube-score](https://github.com/zegl/kube-score) 
* [kubeaudit](https://github.com/Shopify/kubeaudit)
* [Kyverno](https://github.com/kyverno/kyverno)

Platform      | kube-score | Kubeaudit | Kyverno   |
--------------|------------|-----------|-----------|
Docker image  | ✅         | ✅        | ❌       |
Krew          | ✅         | ❌        | ✅       |
Linux         | ✅         | ✅        | ArchLinux|
MacOS         | ✅         | ✅        | ❌       |
Brew          | ✅         | ✅        | ❌       |
Windows       | ✅         | ✅        | ❌       |

In addition, all are written using Golang and can be built from source easily for any platforms.

## 2. Usage

All tools provide a similar cli that can run either on local manifest files 
or directly on a running cluster. Kyverno requires to compile the list of checks to run beforehand.

Method                | kube-score | Kubeaudit | Kyverno   |
----------------------|------------|-----------|-----------|
Manifest files         | ✅         | ✅        | ✅       |
Cluster               | ✅         | ✅        | ✅       |
Admission Controller  | ✅         | ❌        | ❌       |

## 3. Checks

For all of kube-score, kubeaudit and kyverno the checks can be disabled. 
Some checks have advanced configuration noted with 🛠.

Resource | Check                                                | kube-score | Kubeaudit | Kyverno |
---------|-----------------------------------------------------|------------|-----------|----------|
Pod      | Require using `AppArmor`                            | ❌         | ✅        | ✅      |
Pod      | Prevent using default service account               | ❌         | ✅        | ✅      |
Pod      | Restrict using unsecure linux capabilities          | ❌         | ✅ 🛠     | ✅      |
Pod      | Restrict using `HostPID`, `HostIPC` or `HostNetwork`| ❌         | ✅        | ✅      |
Pod      | Require using image tag                             | ✅         | ✅ 🛠     | ✅      |
Pod      | Require using image registry                        | ❌         | ❌        | ✅ 🛠   |
Pod      | Require using `Always` pull policy                  | ✅         | ✅ 🛠     | ✅      |
Pod      | Require using requests and limits                   | ✅         | ✅ 🛠     | ✅      |    
Pod      | Require using same requests as limits               | ✅         | ❌        | ❌      |
Pod      | Restrict mounting sensitive host directories        | ❌         | ✅        | ✅      |
Pod      | Restrict running as root                            | ❌         | ✅        | ✅      |
Pod      | Require running with user and group id > 10000      | ✅         | ❌        | ✅ 🛠   |
Pod      | Restrict privilege escalation                       | ✅         | ✅        | ✅      |
Pod      | Require read-only filesystem                         | ✅         | ✅        | ❌      |
Pod      | Require using `seccomp`                             | ✅         | ✅        | ✅      |
Pod      | Require having at least one `NetworkPolicy`         | ✅         | ❌        | ✅      |
Pod      | Require configuring probes                           | ✅         | ❌        | ✅      |
Pod      | Require using secret from EnvVars                   | ❌         | ❌        | ✅      |
Pod      | Require using `SELinux`                             | ❌         | ❌        | ✅      |
CronJob  | Require deadline                                    | ✅         | ❌        | ❌      |
StatefulSet| Require using `PodDisruptionBudget`               | ✅         | ❌        | ✅      |
StatefulSet| Require using `PodAntiAfinity`                     | ✅         | ❌        | ❌      |
StatefulSet| Require having existing `serviceName`             | ✅         | ❌        | ❌      |
Deployment| Require using `PodDisruptionBudget`                | ✅         | ❌        | ✅      |
Deployment| Require using `PodAntiAfinity`                      | ✅         | ❌        | ❌      |
Deployment| Restrict using both `HorizontalPodAutoscaler` and `replicas`| ✅         | ❌        | ❌      |
Service  | Require targeting a `Pod`                           | ✅         | ❌        | ❌      |
Service  | Restrict using `NodePort` service type              | ✅         | ❌        | ❌      |
Ingress  | Require targeting a `Service`                       | ✅         | ❌        | ❌      |
Namespace| Require default `NetworkPolicy`                     | ❌         | ✅        | ❌      |
Namespace| Restrict using default namespace                    | ❌         | ❌        | ✅      |
NetworkPolicy| Require targeting a `Pod`                       | ✅         | ❌        | ❌      |
HorizontalPodAutoscaler| Require targeting a valid resource    | ✅         | ❌        | ❌      |
All      | Require using non-deprecated stable api version     | ✅         | ❌        | ❌      |
All      | Require labels                                      | ✅         | ❌        | ✅ 🛠   |
All      | Restrict annotations                                | ❌         | ❌        | ✅ 🛠   |

Kube-score is providing a more complete list of security checks out of the box
but Kyverno is completely customizable but requires to build the list of checks to run beforehand.
