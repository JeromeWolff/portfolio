/**
 * Projects for portfolio. Add image, repo, and live URLs as needed.
 * Images: use lazy loading and modern formats (WebP) when you add them.
 */
export interface ProjectItem {
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  repo?: string;
}

export const projectsConfig: { projects: ProjectItem[] } = {
  projects: [
    {
      title: 'Marketplace & franchise platform',
      description:
        'Leading development of a marketplace for online orders at local Edeka stores via a franchise system.',
      tags: ['Marketplace', 'E-commerce'],
      href: undefined,
    },
    {
      title: 'Mobile games & skill-based platform',
      description:
        'Leading development of mobile games and a gaming platform for skill-based competitions.',
      tags: ['Mobile', 'Games', 'TypeScript'],
      href: undefined,
    },
    {
      title: 'Multiplayer mini-games & frameworks',
      description:
        'Development of mini-games and frameworks for a multiplayer network with 4.4M+ registered users. Cassandra, MySQL, Redis, Netty.',
      tags: ['Java', 'Netty', 'Cassandra'],
      href: undefined,
    },
    {
      title: 'React Native & Spring stack',
      description:
        'Mobile app and backend: React Native + TypeScript frontend, Java, Spring, MariaDB backend.',
      tags: ['React Native', 'Spring', 'MariaDB'],
      href: undefined,
    },
  ],
};
