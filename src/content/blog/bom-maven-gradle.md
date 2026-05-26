---
title: 'How BOM Works in Maven and Gradle and Why You Should Use It'
slug: 'bom-maven-gradle-dependency-management'
description: 'A practical breakdown of Bill of Materials (BOM) in Maven and Gradle — what it solves, how it works under the hood, and how to author your own.'
author: 'Jerome Wolff'
publishedAt: 2026-05-26
updatedAt: 2026-05-26
tags: ['maven', 'gradle', 'bom', 'dependency-management', 'java', 'build-tools']
category: 'Software Engineering'
featuredImage: '/images/blog/bom.svg'
draft: false
---

## Dependency Version Management Is a Solved Problem — If You Use the Right Tool

Version conflicts in the JVM ecosystem are a rite of passage. Two libraries pull
in different versions of the same transitive dependency; one wins the classpath
lottery; a `NoSuchMethodError` surfaces in production at 2am. A Bill of
Materials (BOM) is the structural answer to this problem — not a workaround, an
answer.

## What a BOM Is

A BOM is a POM file with `<packaging>pom</packaging>` that declares a
`<dependencyManagement>` block. It contains no compiled code — just version
declarations. Any project that imports the BOM inherits those version
constraints for the listed dependencies, without being forced to use them.

The distinction matters: a BOM **constrains** versions if a dependency is used.
It does not **introduce** dependencies. Your project still declares what it
needs; the BOM dictates what version gets resolved.

Spring Boot's BOM is the canonical example. When you import
`spring-boot-dependencies`, you get pre-aligned versions for Spring Framework,
Micrometer, Jackson, Logback, Hibernate, Netty, and 200+ more artifacts — all
tested together:

```xml
<!-- pom.xml — Maven -->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.4.15</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
<!-- No version needed — BOM provides it -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
</dependency>
</dependencies>
```

No version on `jackson-databind`. Maven resolves it from the BOM's
`<dependencyManagement>` block. The alignment is guaranteed by whoever published
the BOM.

## How Maven Resolves It

Maven's dependency resolution follows a precedence hierarchy:

1. **Direct declaration in the project's own `<dependencyManagement>`** — wins
   everything
2. **BOM imports** — applied in declaration order (first imported BOM wins for a
   given artifact)
3. **Nearest-wins for transitive dependencies** — depth in the dependency graph
   determines resolution

BOM imports are processed as if their `<dependencyManagement>` entries were
inlined at the import site. When two BOMs declare different versions of the same
artifact, the first import wins. This is a source of subtle bugs when composing
multiple BOMs.

```xml
<!-- BOM import order matters -->
<dependencyManagement>
  <dependencies>
    <!-- This BOM's jackson version wins over the second BOM's -->
    <dependency>
      <groupId>com.fasterxml.jackson</groupId>
      <artifactId>jackson-bom</artifactId>
      <version>2.17.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.4.15</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

If the jackson BOM declares `2.17.0` and Spring Boot's BOM declares `2.16.2`,
your project gets `2.17.0` — because jackson-bom is imported first. This may or
may not be what you want. Always validate with `mvn dependency:tree`.

## Gradle: Platform Dependencies

Gradle implements BOM support through the concept of **platforms**. You import a
BOM using `platform()` or `enforcedPlatform()`:

```kotlin
// build.gradle.kts
dependencies {
    // Soft platform — BOM versions are recommendations, can be overridden
    implementation(platform("org.springframework.boot:spring-boot-dependencies:3.4.15"))

    // Hard platform — BOM versions override all, including direct declarations
    implementation(enforcedPlatform("io.quarkus:quarkus-bom:3.10.0"))

    // No version — resolved from the platform
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.core:jackson-databind")
}
```

> [!TIP]
> Prefer `platform()` over `enforcedPlatform()` unless you specifically need
> hard version enforcement. `enforcedPlatform()` overrides even direct version
> declarations in your own build file, which can produce surprising resolution
> outcomes when updating individual dependencies.

Gradle's platform model is richer than Maven's. You can define a local platform
module to centralize version management across a multi-module build:

```kotlin
// platform/build.gradle.kts
plugins {
    `java-platform`
}

javaPlatform {
    allowDependencies() // Allow declaring external BOM imports
}

dependencies {
    api(platform("org.springframework.boot:spring-boot-dependencies:3.4.15"))

    constraints {
        api("org.mapstruct:mapstruct:1.5.5.Final")
        api("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
        api("io.jsonwebtoken:jjwt-api:0.12.6")
        api("io.jsonwebtoken:jjwt-impl:0.12.6")
    }
}
```

```kotlin
// service-a/build.gradle.kts
dependencies {
    implementation(platform(project(":platform")))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.mapstruct:mapstruct") // version from platform
    implementation("io.jsonwebtoken:jjwt-api")  // version from platform
}
```

Every service module in the multi-module build imports the local platform. One
place to update versions. Zero drift between services.

## Authoring Your Own BOM

In a microservices or multi-module monorepo, publishing an internal BOM aligns
every service on shared library versions without per-service negotiation:

```xml
<!-- internal-bom/pom.xml -->
<project>
  <groupId>com.myorg</groupId>
  <artifactId>internal-bom</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <dependencyManagement>
    <dependencies>
      <!-- Import upstream BOMs -->
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>3.4.15</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>

      <!-- Internal library versions — pin these -->
      <dependency>
        <groupId>com.myorg</groupId>
        <artifactId>common-security</artifactId>
        <version>2.4.1</version>
      </dependency>
      <dependency>
        <groupId>com.myorg</groupId>
        <artifactId>common-observability</artifactId>
        <version>1.8.0</version>
      </dependency>
      <dependency>
        <groupId>com.myorg</groupId>
        <artifactId>common-messaging</artifactId>
        <version>3.1.0</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
```

Publish this to your internal Maven repository (Nexus, Artifactory, GitHub
Packages). Every service imports it. When `common-security` releases `2.5.0`,
one BOM version bump propagates to all consumers — with a controlled rollout.

## BOM vs. Parent POM vs. Version Catalog

These serve different purposes and are often confused:

| Mechanism                                         | What It Provides                             | Can Be Composed             | Forces Inheritance   |
| ------------------------------------------------- | -------------------------------------------- | --------------------------- | -------------------- |
| **BOM / Platform**                                | Version constraints only                     | Yes — import multiple       | No                   |
| **Parent POM**                                    | Versions + plugins + build config + defaults | No — single parent only     | Yes (extends parent) |
| **Gradle Version Catalog** (`libs.versions.toml`) | Centralized version aliases, bundles         | N/A (single file per build) | No                   |
| **Gradle Platform module**                        | BOM equivalent for Gradle multi-module       | Yes                         | No                   |

Parent POM is inheritance — a powerful tool with tight coupling. BOM is
composition — flexible, stackable, and less opinionated. For platform teams
managing shared infrastructure, BOMs compose better than parent POMs across team
boundaries.

Gradle's version catalog (`libs.versions.toml`) is complementary to platforms,
not a replacement. Catalogs provide IDE-friendly aliases and bundle groupings;
platforms enforce resolution. Use both:

```toml
# gradle/libs.versions.toml
[versions]
spring-boot = "3.4.15"
mapstruct = "1.5.5.Final"

[libraries]
spring-boot-bom = { module = "org.springframework.boot:spring-boot-dependencies", version.ref = "spring-boot" }
mapstruct = { module = "org.mapstruct:mapstruct", version.ref = "mapstruct" }

[bundles]
spring-web = ["spring-boot-starter-web", "spring-boot-starter-validation"]
```

```kotlin
// build.gradle.kts
dependencies {
    implementation(platform(libs.spring.boot.bom))
    implementation(libs.bundles.spring.web)
    implementation(libs.mapstruct)
}
```

## The Operational Payoff

BOM adoption in a multi-service environment eliminates an entire class of
dependency drift issues:

- No service running `jackson-databind:2.14.x` while another runs `2.17.x`
- No transitive version conflicts between internal libraries that share
  dependencies
- No manual version negotiation in PRs when updating Spring Boot or Hibernate
- Clear upgrade path: bump the BOM version, run dependency validation, roll out

The cost is one additional artifact to publish and version. The return is
consistency across every service that imports it — enforced by the build tool,
not by process or convention.
