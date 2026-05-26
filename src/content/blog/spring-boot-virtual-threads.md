---
title: 'Optimizing Spring Boot Performance Using Virtual Threads'
slug: 'optimizing-spring-boot-performance-virtual-threads'
description: "How Project Loom's virtual threads eliminate thread-per-request bottlenecks in Spring Boot applications and when you should actually use them."
author: 'Jerome Wolff'
publishedAt: 2026-05-26
updatedAt: 2026-05-26
tags: ['spring-boot', 'virtual-threads', 'project-loom', 'java', 'performance', 'concurrency']
category: 'Software Engineering'
featuredImage: '/images/blog/spring-boot.svg'
draft: false
---

## Thread-Per-Request Is a Ceiling, Not a Floor

The traditional thread-per-request model in Spring Boot works — until it
doesn't. At scale, platform threads become the constraint: expensive to create,
memory-hungry, and limited by the OS scheduler. Virtual threads change the
equation entirely.

## What Virtual Threads Actually Do

Virtual threads (JEP 444, GA in Java 21) are lightweight threads managed by the
JVM, not the OS. They mount onto carrier threads (platform threads) only when
executing CPU work — during blocking I/O, they unmount and yield the carrier
thread to another virtual thread.

The result: you can run millions of concurrent tasks without the memory overhead
of OS threads (~1MB stack each). A virtual thread has a small, growable stack
starting at a few KB.

This isn't async/reactive programming. You write blocking code — JDBC,
RestTemplate, `Thread.sleep()` — and the JVM handles the concurrency. No
reactive chains, no `Mono<T>` plumbing.

## Enabling Virtual Threads in Spring Boot 3.2+

Spring Boot 3.2 added first-class support. One property flips the Tomcat
executor to virtual threads:

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true
```

That's the entire change for most applications. Under the hood, Spring replaces
the default `ThreadPoolTaskExecutor` with a virtual-thread-per-task executor
backed by `Executors.newVirtualThreadPerTaskExecutor()`.

For fine-grained control, configure it explicitly:

```java
@Configuration
public class VirtualThreadConfig {

    @Bean(name = "virtualThreadExecutor")
    public Executor virtualThreadExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }

    @Bean
    public TomcatProtocolHandlerCustomizer<?> tomcatVirtualThreadCustomizer() {
        return protocolHandler ->
            protocolHandler.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
    }
}
```

For async tasks and `@Async` methods, wire the executor explicitly:

```java
@Service
public class ReportService {

    @Async("virtualThreadExecutor")
    public CompletableFuture<Report> generateReport(Long reportId) {
        // Blocking I/O — JDBC, file reads, HTTP calls — all fine here
        Report report = reportRepository.findById(reportId).orElseThrow();
        return CompletableFuture.completedFuture(report);
    }
}
```

## Where Virtual Threads Win (and Where They Don't)

The gains are real but not universal. Understanding the profile of your workload
determines whether you'll see 2× throughput or zero difference.

| Workload Type                  | Virtual Thread Benefit | Reason                                                             |
| ------------------------------ | ---------------------- | ------------------------------------------------------------------ |
| I/O-bound (DB, HTTP, disk)     | 🟢 High                | Carrier thread released during blocking; massive concurrency       |
| Mixed I/O + CPU                | 🟡 Moderate            | CPU phases still block carrier; benefit depends on I/O ratio       |
| Pure CPU-bound                 | 🔴 Negligible          | No blocking to yield on; platform threads equally efficient        |
| Synchronized critical sections | 🔴 Negative risk       | Pinning — virtual thread holds carrier during `synchronized` block |
| Reactive (WebFlux) apps        | 🔴 None                | Already non-blocking; adding virtual threads adds overhead         |

**Pinning is the gotcha.** When a virtual thread enters a `synchronized` block
or calls native code, it _pins_ to its carrier thread — it cannot unmount. This
kills the concurrency benefit and can cause carrier thread starvation.

Audit for pinning with JVM flags:

```bash
-Djdk.tracePinnedThreads=full
```

Migrate `synchronized` to `ReentrantLock` or `StampedLock` in hot paths:

```java
// Before — pins virtual thread to carrier
synchronized (this) {
    cache.put(key, value);
}

// After — virtual-thread-friendly
private final ReentrantLock lock = new ReentrantLock();

lock.lock();
try {
    cache.put(key, value);
} finally {
    lock.unlock();
}
```

> [!TIP]
> Run your load tests with `-Djdk.tracePinnedThreads=short` before shipping. A
> single `synchronized` block in a hot path can silently eliminate your throughput
> gains by starving carrier threads.

## Observing the Difference

Benchmarking matters. Here's a minimal k6 load test pattern to validate
throughput:

```javascript
// k6-virtual-threads-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '60s', target: 2000 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:8080/api/reports/1');
  check(res, { 'status 200': (r) => r.status === 200 });
}
```

Monitor Tomcat's active threads via Actuator:

```bash
curl http://localhost:8080/actuator/metrics/tomcat.threads.busy
```

With platform threads and a pool of 200, you hit the ceiling at ~200 concurrent
requests. With virtual threads, the ceiling moves to available memory —
typically tens of thousands of concurrent in-flight requests on a standard JVM
heap.

## Connection Pool Is Now Your Real Bottleneck

With virtual threads, you'll saturate your JDBC or HTTP connection pool long
before your thread model breaks. HikariCP defaults to 10 connections. 10,000
virtual threads blocked on a pool of 10 connections means 9,990 threads
waiting — with no benefit from virtual threads.

Tune your connection pool aggressively:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 100
      minimum-idle: 20
      connection-timeout: 3000
      idle-timeout: 600000
```

Observe pool contention:

```bash
curl http://localhost:8080/actuator/metrics/hikaricp.connections.pending
```

If pending connections spike under load, the pool is your constraint — not
threads.

## Kubernetes Resource Implications

Virtual threads reduce CPU context-switching and memory pressure per concurrent
request. This translates to real infrastructure savings.

```yaml
# deployment.yaml — right-sized for virtual thread workloads
apiVersion: apps/v1
kind: Deployment
metadata:
  name: report-service
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: report-service
          image: report-service:latest
          resources:
            requests:
              memory: '512Mi'
              cpu: '500m'
            limits:
              memory: '1Gi'
              cpu: '2000m'
          env:
            - name: JAVA_TOOL_OPTIONS
              value: >-
                -XX:+UseZGC
                -Xms256m
                -Xmx768m
                -Djdk.tracePinnedThreads=short
```

Pair virtual threads with ZGC or Shenandoah for low-pause GC — the combination
handles high-concurrency workloads cleanly without long stop-the-world pauses.

## Migration Checklist

Before enabling virtual threads in production:

1. **Java 21+** — virtual threads are GA, not preview.
2. **Spring Boot 3.2+** — required for `spring.threads.virtual.enabled`.
3. **Audit `synchronized` blocks** — replace with `ReentrantLock` in I/O paths.
4. **Bump connection pools** — HikariCP, OkHttp, Apache HttpClient.
5. **Remove reactive workarounds** — if you added WebFlux purely for throughput,
   evaluate reverting to MVC.
6. **Load test before shipping** — validate pinning isn't silently capping
   gains.

Virtual threads aren't a silver bullet, but for I/O-bound Spring Boot services,
they're the most impactful single-line performance change available in the Java
ecosystem today.
