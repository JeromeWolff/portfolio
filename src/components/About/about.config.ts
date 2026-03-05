import { Briefcase, Sparkles, Target } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface AboutConfig {
  birthdate: string;
  sections: Array<{
    title: string;
    content: string;
    icon: LucideIcon;
  }>;
}

export const aboutConfig: AboutConfig = {
  birthdate: '2004-07-12',
  sections: [
    {
      title: 'Focus',
      content:
        'Distributed systems, microservices, DevOps/CI/CD, and cloud architecture. Strong in the Java/Spring ecosystems, databases and messaging, and container platforms. I also focus on technical leadership: architecture, platform direction, and delivery enablement.',
      icon: Target,
    },
    {
      title: 'What I work on',
      content:
        'Backend and architecture — designing APIs and services with maintainability and scale in mind. Cloud and platform — containers, orchestration, infrastructure-as-code, observability-ready setups. Delivery — CI/CD pipelines and developer experience improvements that actually ship.',
      icon: Briefcase,
    },
    {
      title: 'Beyond work',
      content:
        "When I'm not designing systems or shipping code, I enjoy exploring fragrances and diving into economics, politics, and strategy.",
      icon: Sparkles,
    },
  ],
};
