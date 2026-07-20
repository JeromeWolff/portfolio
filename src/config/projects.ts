export interface CaseStudy {
  index: string;
  slug: string;
  title: string;
  role: string;
  org: string;
  period: string;
  scale: string;
  stack: readonly string[];
  featured?: boolean;
  /** custom line-diagram to draw for this study */
  diagram: 'network' | 'marketplace' | 'platform' | 'edge';
  summary: string;
  context: string;
  challenge: string;
  approach: readonly string[];
  outcome: string;
  lessons: string;
}

export const projectsConfig = {
  intro:
    "Four systems I've spent real time inside — what they were, what made them hard, and what I'd tell myself before starting again.",
  caseStudies: [
    {
      index: '01',
      slug: 'gommehd',
      title: 'Game frameworks for a network of 4.4M players',
      role: 'Java Developer',
      org: 'GommeHDnet',
      period: '2020 – 2024',
      scale: '4.4M+ registered players',
      stack: ['Java', 'Netty', 'Cassandra', 'Redis', 'MySQL', 'ZooKeeper'],
      featured: true,
      diagram: 'network',
      summary:
        'Shared frameworks and mini-games running across one of the largest German multiplayer networks — code where a single dropped tick is visible to thousands of people at once.',
      context:
        'GommeHD is one of the biggest German-speaking multiplayer networks. I worked on the mini-games and the internal frameworks underneath them: matchmaking, game state, player data, and the plumbing that connects dozens of game servers.',
      challenge:
        "Everything is concurrent and nothing forgives latency. A player joining a round, a stat being written, a server rejoining the cluster — all of it happens thousands of times a minute, and any stall is something real people feel instantly. And the frameworks weren't only mine: other developers built their games on them, so an awkward API was a cost multiplied across the whole team.",
      approach: [
        'Treated the framework as a product with internal users — clear boundaries, sane defaults, and APIs that were hard to misuse.',
        'Kept hot paths off the database: Redis for volatile state, Cassandra for write-heavy player data, MySQL where relational integrity actually mattered.',
        'Leaned on ZooKeeper for coordination and Netty for transport, so servers could come and go without taking live rounds down with them.',
      ],
      outcome:
        "Games and frameworks that held up under the network's real traffic for years — used daily by millions of players, and by the developers building on top of them.",
      lessons:
        'Writing infrastructure other engineers depend on taught me more than any single feature could. The API you ship is the one people live with, so I learned to optimize for the second reader of the code, not the first writer.',
    },
    {
      index: '02',
      slug: 'shabo',
      title: 'A marketplace for local Edeka stores',
      role: 'Chief Technology Officer',
      org: 'Shabo Group',
      period: '2025 – present',
      scale: 'Multi-tenant, franchise-wide',
      stack: ['Java', 'Spring', 'TypeScript', 'React', 'PostgreSQL'],
      diagram: 'marketplace',
      summary:
        'An online-ordering platform that lets independently-run franchise stores sell locally without each one reinventing a webshop.',
      context:
        'Local Edeka stores run as independent franchises. Each needs an online storefront, but none should have to build or operate one alone. We are building the shared platform: one system, many stores, each with its own catalogue, pricing and logistics.',
      challenge:
        'Multi-tenancy is the whole problem in disguise. Stores need to feel independent — their own products, prices, delivery zones — while everything runs on one codebase and one operations team. Get the tenant boundaries wrong early and you pay for it in every feature afterwards.',
      approach: [
        'Modeled the store as the tenant boundary from day one, so isolation is a property of the data model rather than something bolted on later.',
        'Kept ordering, catalogue and logistics as separate domains, so each can evolve — and be reasoned about — on its own.',
        'Chose boring, well-understood tools so the team spends its attention on the domain, not on the framework.',
      ],
      outcome:
        'A platform taking shape that store owners can run without a technical background, and that we can extend to new stores without forking the code.',
      lessons:
        "As CTO, the hardest calls are the ones you make before there's traffic to justify them. I spend architectural budget where reversing the decision later would be expensive, and stay cheap everywhere else.",
    },
    {
      index: '03',
      slug: 'valorbyte',
      title: 'A platform for skill-based competition',
      role: 'CTO & Managing Director',
      org: 'Valorbyte',
      period: '2025 – present',
      scale: 'Mobile games + platform',
      stack: ['Java', 'Spring', 'Unity', 'C#', 'ASP.NET'],
      diagram: 'platform',
      summary:
        'Mobile games, plus the backend that turns them into fair, real-money skill competitions.',
      context:
        'Valorbyte builds mobile games and a platform that runs skill-based competitions on top of them. The games are the fun part; the platform is where trust lives — matchmaking, results, payouts, and the rules that keep it fair.',
      challenge:
        'When money rides on a match, correctness and fairness stop being nice-to-haves. Results have to be verifiable, matches have to be tamper-resistant, and the whole thing has to feel instant on a phone with a flaky connection.',
      approach: [
        'Split the playful client from the authoritative backend: the game entertains, the server decides.',
        'Designed the competition and wallet logic to be auditable, so a disputed result has a single source of truth.',
        'Built the platform to be game-agnostic, so a new title plugs into matchmaking and payouts instead of rebuilding them.',
      ],
      outcome:
        'A shared platform new games can sit on top of, rather than a stack of one-off backends.',
      lessons:
        "Running engineering here means I own the trade-offs end to end — from a Unity frame budget to the company's cash flow. It's made me far more deliberate about what 'done' actually means.",
    },
    {
      index: '04',
      slug: 'sovereign-serverless',
      title: 'Serverless functions on German infrastructure',
      role: 'Personal project',
      org: 'Independent',
      period: 'Ongoing',
      scale: 'Research & prototype',
      stack: ['Rust', 'WASM', 'Kubernetes', 'Hetzner'],
      diagram: 'edge',
      summary:
        'A function platform built around data sovereignty: deploy small units of code that run entirely on German-hosted infrastructure.',
      context:
        'Plenty of European teams want serverless ergonomics without their data leaving the jurisdiction. This is my ongoing exploration of what that platform looks like — push a function, get an endpoint, and know exactly where it runs.',
      challenge:
        'Serverless is easy to describe and hard to make cheap. Cold starts, isolation between tenants, and predictable performance all fight each other — especially without a hyperscaler’s scale to hide the costs.',
      approach: [
        'Chose WASM as the isolation unit — small, fast to start, sandboxed by design — with Rust for the runtime around it.',
        'Targeted commodity German hosting to prove the economics work without hyperscaler pricing.',
        'Kept the developer surface tiny: a platform’s job is to disappear.',
      ],
      outcome:
        'A working answer to a question I kept running into: can you have serverless ergonomics and data sovereignty at the same time?',
      lessons:
        'Building this from scratch is the clearest reminder of how much a platform does for you invisibly. Every convenience I’d taken for granted is a decision someone once made — and now I’m the one making them.',
    },
  ] satisfies CaseStudy[],
} as const;
