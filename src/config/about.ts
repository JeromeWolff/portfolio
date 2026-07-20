export const aboutConfig = {
  birthdate: '2004-07-12',
  location: 'Rügen, Germany',

  // First-person narrative — plain, specific, no slogans.
  paragraphs: [
    'I got into this the practical way. My first paid work was keeping a company’s website running and, on one memorable occasion, programming a Siemens controller for an aquaponics system in ladder logic — a sentence I still enjoy saying out loud.',
    'From there I spent four years building game frameworks for a multiplayer network used by millions of people. That’s where I learned what “at scale” actually costs, and why the unglamorous parts — data models, coordination, APIs other people rely on — are the parts that decide whether a system survives.',
    'Now I lead engineering as CTO at a few companies: a skill-gaming platform, a franchise marketplace. So I spend about as much time on architecture and helping a team ship as I do writing code myself. What I care about is the boring kind of good — systems that stay up, code the next person can read, and decisions that still look sensible a year later.',
  ],

  // What I build — kept short and concrete.
  building: [
    'Backend systems, APIs & microservices',
    'Cloud platforms, Kubernetes & infrastructure-as-code',
    'CI/CD pipelines & developer tooling',
    'Mobile & web products, zero to production',
  ],

  // Field-note facts for the mono data column ("Age" is computed at build time).
  facts: [
    { key: 'Based', value: 'Rügen, Germany' },
    { key: 'Focus', value: 'Distributed systems' },
    { key: 'Stack', value: 'JVM · Rust · TypeScript' },
    { key: 'Cloud', value: 'K8s · Hetzner · AWS · GCP' },
  ],

  // A human sign-off — the off-clock detail.
  offClock:
    'Off the clock I read about economics, politics and strategy — and, less defensibly, I collect fragrances.',
} as const;
