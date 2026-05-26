---
title: 'Optimizing Spring Boot Startup Time with Lazy Initialization'
slug: 'optimizing-spring-boot-startup-lazy-initialization'
description: 'A practical guide to cutting Spring Boot startup time using lazy initialization — what it buys you, what it hides from you, and how to use it safely in production.'
author: 'Jerome Wolff'
publishedAt: 2026-05-26
updatedAt: 2026-05-26
tags: ['spring-boot', 'startup-time', 'lazy-initialization', 'performance', 'jvm', 'cloud-native']
category: 'Software Engineering'
featuredImage: '/images/blog/spring-boot.svg'
draft: false
---

## Startup Time Is a Deployment KPI, Not a Footnote

In a cloud-native world, startup time determines how fast you scale out, how
quickly you recover from crashes, and how responsive your CI/CD pipeline feels.
A Spring Boot service that takes 30 seconds to boot is a liability — in
Kubernetes autoscaling, in serverless, and in developer feedback loops.

Lazy initialization is the lowest-friction lever you have.

## What Lazy Initialization Does

By default, Spring initializes every bean in the ApplicationContext at startup.
Every `@Service`, `@Repository`, `@Component`, `@Configuration` — all wired,
validated, and ready before the first request arrives.

Lazy initialization inverts this: beans are created on first use, not at
startup. The container registers bean definitions but defers actual construction
until something requests the bean — typically the first HTTP request or
scheduled task that triggers the dependency chain.

The result is a thinner, faster startup. The cost is deferred bean-wiring errors
and cold-start latency on first access.

## Enabling Globally

```yaml
# application.yml
spring:
  main:
    lazy-initialization: true
```

One line. For a medium-complexity Spring Boot app with 200–400 beans, expect
30–60% startup time reduction. For smaller apps or microservices, gains can
reach 70%+.

Baseline your startup time before and after with:

```bash
# Spring Boot logs startup time automatically
# Look for: "Started MyApplication in X.XXX seconds"

# Or measure precisely:
time java -jar target/myapp.jar --spring.main.web-environment=false
```

> [!TIP]
> Combine `lazy-initialization: true` with `-Xms` tuned low and a GraalVM native
> build if you need sub-second cold starts in serverless or spot-instance
> workloads. Each optimization stacks independently.

## The Tradeoff You Can't Ignore

Lazy initialization moves failure from startup to runtime. That's a meaningful
shift in operational risk.

| Behavior                   | Eager (Default)   | Lazy                             |
| -------------------------- | ----------------- | -------------------------------- |
| Bean wiring errors         | Caught at startup | Surface on first use             |
| DB connection validation   | Startup           | First DB query                   |
| Misconfigured properties   | Startup           | When the bean is first needed    |
| Startup time               | Slower            | Faster                           |
| First-request latency      | Normal            | Elevated (cold bean init)        |
| Memory at startup          | Higher            | Lower                            |
| Kubernetes readiness probe | Reliable signal   | Requires careful configuration   |
| Error visibility in CI/CD  | Immediate         | Delayed — may slip to production |

The critical risk: if a misconfigured bean is rarely accessed, the error stays
dormant in production until a specific code path triggers it. In eager mode,
that bug doesn't survive startup.

## Selective Lazy Initialization

Global lazy init is a blunt instrument. The safer production pattern is \*
\*selective\*\*: eager-initialize the beans that matter (DB, security,
messaging),
lazy-initialize the rest.

```java
// Mark specific beans as eager — overrides global lazy setting
@Component
@Lazy(false)
public class DatabaseHealthValidator implements ApplicationRunner {

    private final DataSource dataSource;

    public DatabaseHealthValidator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            conn.isValid(2);
        }
    }
}
```

Alternatively, mark individual beans as `@Lazy` explicitly rather than enabling
it globally:

```java
@Configuration
public class ReportingConfig {

    // Heavy PDF/Excel rendering engine — only needed for /reports/** endpoints
    @Bean
    @Lazy
    public ReportRenderingEngine reportRenderingEngine() {
        return new HeavyReportRenderingEngine(); // 2–3 second initialization
    }
}
```

This approach is surgical: you keep eager validation for infrastructure beans
while deferring expensive, rarely-used components.

## Kubernetes Readiness Probe Interaction

This is where lazy initialization causes real production incidents if you skip
it.

A Kubernetes readiness probe might return `200 OK` as soon as the HTTP server
starts accepting connections — which happens quickly with lazy init. But the app
isn't actually ready: its database pool isn't initialized, its Kafka consumers
aren't connected, its caches aren't warmed.

Traffic hits the pod, triggers bean initialization under load, and users see
elevated latency or errors during the first few seconds.

Fix this with a startup probe and a `@EventListener` or `ApplicationRunner`
warm-up:

```java
@Component
public class StartupWarmup implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProductCacheService cacheService;

    public StartupWarmup(UserRepository userRepository,
                         ProductCacheService cacheService) {
        this.userRepository = userRepository;
        this.cacheService = cacheService;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Force lazy beans to initialize before readiness probe signals OK
        userRepository.count();
        cacheService.warmUp();
    }
}
```

Configure Kubernetes startup probes accordingly:

```yaml
# deployment.yaml
startupProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  failureThreshold: 30
  periodSeconds: 2

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 0
  periodSeconds: 5
  failureThreshold: 3
```

Use Spring Boot Actuator's readiness state to gate traffic until warm-up
completes:

```java
@Component
public class StartupWarmup implements ApplicationRunner {

    private final ApplicationContext context;
    private final ApplicationEventPublisher publisher;

    @Override
    public void run(ApplicationArguments args) {
        warmUpCriticalBeans();
        publisher.publishEvent(new AvailabilityChangeEvent<>(
            context, ReadinessState.ACCEPTING_TRAFFIC));
    }
}
```

## Measuring What Actually Changed

Don't guess — measure the bean initialization breakdown:

```bash
java -jar myapp.jar \
  -Dspring.main.lazy-initialization=true \
  -Dlogging.level.org.springframework.beans.factory=DEBUG \
  2>&1 | grep "Creating instance of bean"
```

For structured profiling, use Spring Boot's built-in startup metrics:

```yaml
spring:
  application:
    name: my-service

management:
  endpoints:
    web:
      exposure:
        include: startup, health, info
```

```bash
# After startup, inspect the bean init timeline
curl http://localhost:8080/actuator/startup | jq '.timeline.events[] | select(.startupStep.name == "spring.beans.instantiate") | {name: .startupStep.tags[0].value, duration: .duration}'
```

This surfaces which beans are expensive to initialize and whether lazy init is
actually deferring them.

## Real Numbers

Measured on a typical microservice: Spring Boot 3.3, ~250 beans, embedded
Tomcat, connecting to PostgreSQL via HikariCP.

| Configuration                   | Startup Time | First-Request P50 | First-Request P99 |
| ------------------------------- | ------------ | ----------------- | ----------------- |
| Eager (default)                 | 8.4s         | 12ms              | 45ms              |
| Global lazy                     | 3.1s         | 380ms             | 920ms             |
| Selective lazy + warmup         | 4.8s         | 15ms              | 52ms              |
| Selective lazy + GraalVM native | 0.4s         | 14ms              | 48ms              |

Selective lazy with a warm-up is the pragmatic production default: meaningful
startup savings without the first-request latency spike.

## When Lazy Init Doesn't Help

- **GraalVM native images** — beans are initialized at build time (AOT). Lazy
  init has no effect at runtime because the context is already pre-initialized.
- **Beans with `@PostConstruct` heavy logic** — deferring init defers the work,
  not the cost. A bean that takes 3 seconds to initialize takes 3 seconds
  whenever it's first used.
- **Apps dominated by library auto-configurations** — Spring Boot auto-configs
  for security, JPA, and messaging are already optimized; the gains from lazying
  them are marginal and the risk is higher.

Lazy initialization is a precision tool. Apply it with profiling data, validate
with production-grade load tests, and always guard your readiness probes.
