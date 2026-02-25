/**
 * Tech stack from README — Software Architect & Full-Stack Engineer (Java/Cloud).
 * Grouped by category for scannability.
 */
export const skillsConfig = {
  categories: [
    {
      title: 'Languages',
      items: ['Java', 'Kotlin', 'TypeScript', 'JavaScript', 'C#', 'Rust', 'Python'],
    },
    {
      title: 'Backend',
      items: [
        'Spring Boot',
        'Spring Cloud',
        'ASP.NET',
        'Axum',
        'Actix-web',
        'REST',
        'gRPC',
        'WebSockets',
      ],
    },
    {
      title: 'DevOps & Cloud',
      items: [
        'Docker',
        'Kubernetes',
        'CI/CD',
        'ArgoCD',
        'Terraform',
        'AWS',
        'Google Cloud',
        'Hetzner',
      ],
    },
    {
      title: 'Data & Messaging',
      items: [
        'PostgreSQL',
        'MySQL',
        'MariaDB',
        'MongoDB',
        'Cassandra',
        'Redis',
        'Kafka',
        'RabbitMQ',
      ],
    },
    {
      title: 'Frontend & Mobile',
      items: ['React', 'React Native', 'Angular', 'Astro', 'Flutter', 'HTML/CSS'],
    },
  ],
} as const;
