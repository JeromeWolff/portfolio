import { type LucideIcon, Cloud, Gamepad2, ShoppingCart } from 'lucide-react';

export interface ProjectItem {
  title: string;
  description: string;
  icon?: LucideIcon;
  tags?: string[];
  href?: string;
  repo?: string;
}

export const projectsConfig: { projects: ProjectItem[] } = {
  projects: [
    {
      title: 'Platform for Serverless Functions on German Infrastructure',
      description:
        'Development of a platform for deploying and managing serverless functions hosted entirely on German infrastructure with a focus on data sovereignty, scalability, and developer-friendly APIs.',
      icon: Cloud,
      tags: ['Serverless', 'Cloud', 'Infrastructure', 'Rust', 'WASM'],
      href: undefined,
    },
    {
      title: 'Marketplace & Franchise Platform',
      description:
        'Leading development of a marketplace platform enabling local franchise stores to manage online orders, inventory, and logistics through a scalable multi-tenant architecture.',
      icon: ShoppingCart,
      tags: ['Marketplace', 'E-Commerce', 'Franchise', 'Python', 'Angular', 'Rust'],
      href: undefined,
    },
    {
      title: 'Multiplayer Games, Frameworks & Backends',
      description:
        'Development of multiplayer games and backend frameworks powering a large-scale gaming network with millions of registered users using distributed systems and high-performance networking.',
      icon: Gamepad2,
      tags: ['Java', 'ASP.NET', 'Games', 'Backend', 'Distributed Systems'],
      href: undefined,
    },
  ],
};
