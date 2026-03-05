import { Cloud, Code2, Database, Languages, Smartphone } from 'lucide-react';

export const skillsConfig = {
  categories: [
    {
      title: 'Languages',
      icon: Languages,
      items: ['Java', 'Kotlin', 'TypeScript', 'JavaScript', 'C#', 'Rust', 'Python'],
    },
    {
      title: 'Backend',
      icon: Code2,
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
      icon: Cloud,
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
      icon: Database,
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
      icon: Smartphone,
      items: ['React', 'React Native', 'Angular', 'Astro', 'Flutter', 'HTML/CSS'],
    },
  ],
} as const;
