import { Code2 } from 'lucide-react';
import React, { useMemo } from 'react';

import { skillsConfig } from './skills.config';

interface SkillsProps {
  title?: string;
  categories?: ReadonlyArray<{
    title: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    items: readonly string[];
  }>;
}

export const Skills: React.FC<SkillsProps> = React.memo(
  ({ title = 'Skills', categories = skillsConfig.categories }) => {
    const rows = useMemo(
      () =>
        categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="skills-row" aria-label={`${cat.title} skills`}>
              <span className="skills-row-label">
                {Icon && <Icon size={16} aria-hidden className="skills-row-icon" />}
                {cat.title}
              </span>
              <ul className="skills-pills" role="list">
                {cat.items.map((skill, j) => (
                  <li key={j}>
                    <span className="skills-pill">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }),
      [categories]
    );

    return (
      <section id="skills" className="skills" aria-labelledby="skills-heading">
        <div className="skills-inner">
          <h2 id="skills-heading" className="skills-title">
            <Code2 size={28} aria-hidden className="skills-title-icon" />
            {title}
          </h2>
          <div className="skills-list">{rows}</div>
        </div>
      </section>
    );
  }
);
