---
title: "Load testing for containerized Java"
date: 2021-06-21T00:00:00+02:00
draft: true
---

How to define load testing? What is a good load testing method?
Let's see how load testing a containerized Java web application 
running in a Docker container using [k6](https://k6.io).

<!--more--> 

# What is Load testing?

Load testing is not dedicated to software. 
It can and it is applied to a wide range of domains and systems. 

> Load testing is the process of modeling a system behavior under predetermined load and fixed constraints

Behind that very generic description there are multiple different scenarios a system can be tested against.

## A road example
{{< figure src="eric-weber-GAVSpEx6ooc-unsplash.jpg" >}}

Let's consider a small road across countryside. That same road could have multiple different cars or truck
traveling on it. It can be either hundred of standard urban cars (Sedan) during a bank holiday, 
a sport car trying to go as fast as possible, or even an overloaded truck transporting an exceptional load.
When load testing that road, there will be one different test for each different utilisation case.

### Types of load testing

As we have different vehicle class that can travel on the road, 
all the performance tests are categorized and named depending on the type of load the system is tested under.

{{< figure src="load-testing.png" >}}

* <u>Smoke test:</u> validates that the system is working under normal load and conditions.
* <u>Performance test:</u> evaluate the system's ability to handle concurrency or high load.
* <u>Stress test:</u>: finding the limits of the system under extra-ordinary load.
* <u>Spike test:</u>: verifying the system's resiliency under a burst of extra-ordinary load.
* <u>Soak test:</u> monitoring the reliability of a system over an extended period of time.

# Testing method

Configure  Measure Analyse

> **System constraints are the most important**

## Configure

In order to have a repeatable test, all the systems involved 
need to be configured using fixed values.

### Middleware (Tomcat, Jetty)

Request processor  
HTTP Thread Pool  
Data Source Pool  

### Java Virtual Machine

Heap memory  
Memory ratio  
Garbage Collector  

### Server and OS (Container)

CPU  
Memory  
Disk I/O  

## Measure

> Measure everything!

### System constraints

CPU  
Memory  
Threads  
Data Sources  
Network  
Disk I/O

### Test results

Throughput  
Error rate  
Latency  
Availability  

### VisualVM

#### JVM Resources

#### CPU Sampling

#### MBeans

## Analyse

### Statistics

Min  
Mean  
Max  
Percentile  
Median  

### Why use percentiles?

Here is a typical histogram of request response time:
<div>
  <canvas id="myChart"></canvas>
</div>

### SLI, SLO, SLA

#### Service Level Indicators

> All measurements should be «Service Level Indicators»

#### Service Level Objectives

#### Service Level Agreements

# Case study

## mock-load-testing

## Testing environment

### Configure

### Measure

### Analyse



# Common issues

## Baseline

<div class="iframe-container">
    <iframe src="https://kissy.github.io/local-java-load-testing/dashboard-solo/snapshot/index.html?orgId=1&kiosk&from=1603807020000&to=1603807740000&var-Measurement=http_req_duration&var-Container=performance-testing_application_1&var-Agent=http:%2F%2Fapplication:8081%2Factuator%2Fjolokia&panelId=1" height="300em" frameborder="0"></iframe>
</div>

## Datasource bottleneck

## Memory bottleneck

## Compute bottleneck

## GC bottleneck

# Summary
