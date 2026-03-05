import { ExternalLink, FolderKanban } from 'lucide-react';
import React, { useMemo } from 'react';

import { Section } from '../';

import { projectsConfig } from './projects.config';

import type { ProjectItem } from './projects.config';

interface ProjectsProps {
  title?: string;
  projects?: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = React.memo(
  ({ title = 'Projects', projects = projectsConfig.projects }) => {
    const items = useMemo(
      () =>
        projects.map((p, i) => {
          const Icon = p.icon;
          return (
            <article key={i} className="project-subsection">
              <h3 className="project-subsection-heading">
                {Icon && <Icon size={18} aria-hidden className="project-subsection-icon" />}
                {p.title}
              </h3>
              <p className="project-subsection-text">{p.description}</p>
              {p.tags && p.tags.length > 0 && (
                <ul className="project-subsection-tags" aria-label="Technologies" role="list">
                  {p.tags.map((tag, j) => (
                    <li key={j}>
                      <span className="project-subsection-tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              )}
              {(p.href || p.repo) && (
                <div className="project-subsection-links">
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-subsection-link"
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
                      className="project-subsection-link"
                    >
                      <ExternalLink size={14} aria-hidden />
                      Repo
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        }),
      [projects]
    );

    return (
      <Section
        id="projects"
        titleId="projects-heading"
        title={title}
        titleIcon={<FolderKanban size={28} aria-hidden />}
        className="projects-section"
        titleClassName="projects-title"
        contentClassName="projects-content"
      >
        <div className="projects-grid">{items}</div>
      </Section>
    );
  }
);
