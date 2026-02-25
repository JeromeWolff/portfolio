import { ExternalLink, FolderKanban } from 'lucide-react';
import React, { useMemo } from 'react';

import { Card } from '../Card';

import { projectsConfig } from './projects.config';

import type { ProjectItem } from './projects.config';

/**
 * SEO: Section "Projects" with H2; dense responsive grid (cards, not huge stacks).
 */
interface ProjectsProps {
  title?: string;
  projects?: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = React.memo(
  ({ title = 'Projects', projects = projectsConfig.projects }) => {
    const cards = useMemo(
      () =>
        projects.map((p, i) => (
          <Card key={i} className="project-card" as="article">
            <h3 className="project-card-title">{p.title}</h3>
            <p className="project-card-description">{p.description}</p>
            {p.tags && p.tags.length > 0 && (
              <ul className="project-card-tags" aria-label="Technologies">
                {p.tags.map((tag, j) => (
                  <li key={j} className="project-card-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {(p.href || p.repo) && (
              <div className="project-card-links">
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-link"
                  >
                    <ExternalLink size={14} aria-hidden />
                    View live
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-link"
                  >
                    <ExternalLink size={14} aria-hidden />
                    Repo
                  </a>
                )}
              </div>
            )}
          </Card>
        )),
      [projects]
    );

    return (
      <section id="projects" className="projects" aria-labelledby="projects-heading">
        <div className="projects-inner">
          <h2 id="projects-heading" className="projects-title">
            <FolderKanban size={28} aria-hidden className="projects-title-icon" />
            {title}
          </h2>
          <div className="projects-grid">{cards}</div>
        </div>
      </section>
    );
  }
);
