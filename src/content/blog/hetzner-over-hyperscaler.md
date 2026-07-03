---
title: 'Hetzner vs AWS, GCP, and Azure: Why I Run Most Projects on Hetzner'
slug: 'hetzner-over-aws-gcp-azure'
description: 'A pragmatic Hetzner vs AWS, GCP, and Azure comparison — covering price-to-performance, Kubernetes, data residency, and when hyperscalers are actually worth it.'
author: 'Jerome Wolff'
publishedAt: 2026-05-26
updatedAt: 2026-05-26
tags: ['hetzner', 'cloud-infrastructure', 'devops', 'cost-optimization', 'self-hosting', 'aws']
category: 'Cloud Architecture'
featuredImage: '/images/blog/hetzner-over-aws-gcp-azure-cover.svg'
draft: false
---

## Most Projects Are Not Google Scale and Infrastructure Should Reflect That

The hyperscaler default — AWS, GCP, Azure — made sense when they had no
competition and cloud was new. In 2026, running a production SaaS on AWS without
a deliberate cost strategy means paying 3–5× more than necessary for compute
that a European VPS provider delivers for a fraction of the price. Hetzner is
that provider, and it's not a compromise.

## The Price Reality

Concrete numbers. A workload requiring 8 vCPUs and 32GB RAM:

| Provider      | Instance Type                | Monthly Cost (approx.) |
| ------------- | ---------------------------- | ---------------------- |
| Hetzner Cloud | CCX33 (8 vCPU, 32GB)         | ~€77                   |
| AWS           | c7g.2xlarge (8 vCPU, 16GB)   | ~$230                  |
| AWS           | m7g.2xlarge (8 vCPU, 32GB)   | ~$310                  |
| GCP           | n2-standard-8 (8 vCPU, 32GB) | ~$290                  |
| Azure         | D8s v5 (8 vCPU, 32GB)        | ~$320                  |

Hetzner is not cheaper by 20%. It's cheaper by 70–80%. For a stack running 5–10
servers, that's the difference between a €500/month infrastructure bill and a
€3,000/month one.

Add managed databases, load balancers, object storage, and network egress to
AWS, and the gap widens further — AWS charges for egress at $0.09/GB. Hetzner
includes 20TB of traffic per server per month in the base price. For
data-intensive applications, this alone justifies the switch.

## What Hetzner Actually Offers

Hetzner Cloud is not a bare-metal provider with a web UI bolted on. It's a full
cloud platform:

- **Compute**: Shared and dedicated vCPU instances (AMD and Intel), ARM64
  instances
- **Block storage**: Up to 10TB volumes, attachable to any server
- **Object storage**: S3-compatible (Hetzner Object Storage) via API
- **Load balancers**: Layer 4 and Layer 7, automatic TLS
- **Private networking**: VLAN-based private networks, firewall rules
- **Kubernetes**: no managed control plane — run self-managed K8s (k3s/kubeadm)
  with the Hetzner Cloud Controller Manager and CSI driver
- **Datacenters**: Nuremberg, Falkenstein, Helsinki (EU); Ashburn, Hillsboro (
  US)

The API is clean, the Terraform provider is first-class, and the developer
experience is straightforwardly better than navigating AWS console.

## Infrastructure as Code on Hetzner

The Hetzner Terraform provider is mature and covers the full platform:

```hcl
# main.tf
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.47"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_network" "main" {
  name     = "production-network"
  ip_range = "10.0.0.0/16"
}

resource "hcloud_network_subnet" "app" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.0.1.0/24"
}

resource "hcloud_server" "app" {
  count       = 3
  name        = "app-${count.index + 1}"
  server_type = "cx32"  # 4 vCPU, 8GB, €19.79/mo
  image       = "ubuntu-24.04"
  location    = "nbg1"

  network {
    network_id = hcloud_network.main.id
    ip         = "10.0.1.${count.index + 10}"
  }

  user_data = file("cloud-init/app.yaml")
}

resource "hcloud_load_balancer" "main" {
  name               = "app-lb"
  load_balancer_type = "lb11"
  location           = "nbg1"
}

resource "hcloud_load_balancer_target" "app" {
  count            = 3
  type             = "server"
  load_balancer_id = hcloud_load_balancer.main.id
  server_id        = hcloud_server.app.id
  use_private_ip   = true
}

resource "hcloud_server" "postgres" {
  name        = "app-postgres"
  server_type = "cx32" # 4 vCPU, 8GB — run Postgres yourself, no managed offering
  image       = "ubuntu-24.04"
  location    = "nbg1"

  network {
    network_id = hcloud_network.main.id
    ip         = "10.0.1.20"
  }
}
```

Hetzner has no managed database service, so PostgreSQL/MySQL runs on a
dedicated server (or a Kubernetes StatefulSet) with your own backup and
failover tooling — [Patroni](https://patroni.readthedocs.io/) or a managed
backup script to Object Storage are common choices.

No vendor lock-in beyond the Hetzner API itself — and switching providers means
changing a Terraform provider and resource types, not rewriting application
code.

## Kubernetes on Hetzner

Self-managed Kubernetes on Hetzner with `k3s` and the Hetzner Cloud Controller
Manager is a common production pattern:

```bash
# k3s control plane install
curl -sfL https://get.k3s.io | sh -s - server \
  --disable=traefik \
  --disable=servicelb \
  --node-label="node-role=control-plane"

# Worker join
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<node-token> sh -
```

```yaml
# hcloud-secret.yaml — Hetzner Cloud Controller Manager
apiVersion: v1
kind: Secret
metadata:
  name: hcloud
  namespace: kube-system
stringData:
  token: '<hetzner-api-token>'
  network: '<network-id>'
```

With the CCM installed, Kubernetes LoadBalancer services automatically provision
Hetzner Load Balancers. Persistent volumes use Hetzner block storage via the CSI
driver. Unlike EKS or GKE, there's no managed control plane — you own etcd,
upgrades, and control-plane HA yourself (tools like
[kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
or managed k3s setups reduce that burden but don't remove it).

> [!TIP]
> Deploy your Hetzner Kubernetes cluster across Hetzner's Nuremberg and
> Falkenstein locations using private networking between sites. You get geographic
> redundancy within a single €0/GB private network, compared to AWS inter-AZ data
> transfer charges at $0.01/GB which compound significantly at scale.

## GDPR and Data Residency

Hetzner is a German company, subject to GDPR. Data stored in their EU
datacenters stays in the EU under German/Finnish jurisdiction — a hard
requirement for many European enterprise customers, healthcare workloads, and
financial services applications.

AWS and GCP offer EU regions, but their parent companies (Amazon, Google) are US
entities subject to CLOUD Act jurisdiction — a compliance consideration that
some data controllers cannot accept. Hetzner sidesteps this entirely.

For EU-based startups building B2B SaaS for European customers, this is not a
minor point.

## When Hyperscalers Are the Right Call

Hetzner is not always the answer. Be specific about when you actually need
AWS/GCP/Azure:

| Use Case                                       | Hyperscaler Justified? | Reason                                       |
| ---------------------------------------------- | ---------------------- | -------------------------------------------- |
| Global multi-region (10+ regions)              | Yes                    | Hetzner has 5 locations vs 30+ for AWS       |
| AWS-native services (Bedrock, SageMaker, etc.) | Yes                    | No Hetzner equivalent                        |
| Enterprise compliance (FedRAMP, HIPAA BAA)     | Yes                    | Hetzner not certified                        |
| Kubernetes at 1000+ node scale                 | Yes                    | Managed control plane at that scale matters  |
| Managed database with HA/PITR out of the box   | Yes                    | Hetzner has no managed database offering     |
| Serverless / event-driven workloads            | Yes                    | Lambda, Cloud Run have no Hetzner equivalent |
| Startup with AWS credits ($100k+)              | Situationally          | Use the credits, then re-evaluate            |
| Standard web/API/data workloads                | No                     | Hetzner delivers the same outcome cheaper    |
| Side projects, developer tools, SaaS MVPs      | No                     | 70% cost reduction with zero capability loss |

The pattern is clear: hyperscalers are justified when you need their specific
managed services (managed databases, managed Kubernetes control planes) or
global footprint. For general compute, object storage, and self-managed
databases and Kubernetes — Hetzner delivers the same outcome at a fraction of
the cost, in exchange for owning more of the operational work yourself.

## The Operational Reality

Hetzner's uptime track record is solid. Their status page history shows
availability comparable to major cloud providers for standard compute — not
identical, and without the SLA-backed guarantees of AWS, but sufficient for most
production workloads when running with redundancy.

Support is email-based, not 24/7 phone. For teams with internal infrastructure
competence, this is fine. For teams that need a support contract with guaranteed
response SLAs, that's a real gap.

The network is Hetzner's own — fast within their infrastructure, standard
commodity uplinks externally. For globally distributed CDN-sensitive workloads,
supplement with Cloudflare (free tier covers most cases) in front of Hetzner
origin servers.

## The Default Should Be Hetzner

The mental model I've landed on: **start on Hetzner, migrate specific workloads
to hyperscalers when a concrete requirement forces it.** Not the reverse — don't
start on AWS because it's the default, then discover you're spending
€5,000/month on infrastructure a €400/month Hetzner stack would handle
identically.

Money spent on compute that doesn't need to be on AWS is money not spent on
engineers, product, or users. For a funded startup, that's an engineering
decision with direct business consequences. For a bootstrapped project, it's the
difference between sustainable and not.

The best infrastructure is the infrastructure you don't have to think about
because it's reliable, affordable, and operationally simple. Hetzner delivers
that for the majority of production workloads I run.
