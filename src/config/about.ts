export const aboutConfig = {
  birthdate: '2004-07-12',
  intro:
    'Software engineer and technical founder. I design systems that scale and lead teams that ship — from backend architecture to cloud infrastructure to developer experience.',
  location: 'Germany',
  sections: [
    {
      title: 'Focus',
      content:
        'Distributed systems, microservices, DevOps/CI/CD, and cloud-native architecture. Strong in the Java/Spring ecosystem, container platforms, and observability tooling. I also lead engineering at the organizational level — architecture decisions, platform direction, and delivery enablement.',
      icon: 'Target',
    },
    {
      title: 'What I build',
      items: [
        'Backend systems, APIs & microservices',
        'Cloud platforms, Kubernetes & infrastructure-as-code',
        'CI/CD pipelines & developer tooling',
        'Mobile & web products from zero to production',
      ],
      icon: 'Briefcase',
    },
    {
      title: 'Beyond work',
      content:
        "When I'm not designing systems or shipping code, I enjoy exploring fragrances and diving into economics, politics, and strategy.",
      icon: 'Sparkles',
    },
  ],
} as const;
