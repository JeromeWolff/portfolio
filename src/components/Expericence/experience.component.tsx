import { Section } from '@components/Section';
import { Briefcase } from 'lucide-react';
import React, { useMemo } from 'react';

import { experienceConfig } from './experience.config';

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description?: string;
}

interface ExperienceProps {
  title?: string;
  experiences?: ExperienceItem[];
}

const currentRegex = /heute|present|current/i;

export const Experience: React.FC<ExperienceProps> = React.memo(
  ({ title = 'Experience', experiences = experienceConfig.experiences }) => {
    const items = useMemo(
      () =>
        experiences.map((exp, idx) => {
          const isCurrent = currentRegex.test(exp.duration);
          return (
            <li key={idx} className="experience-item">
              <div className="experience-marker" aria-hidden />
              <div className="experience-body">
                <div className="experience-meta">
                  <span className="experience-role">{exp.role}</span>
                  <span className="experience-company">{exp.company}</span>
                  <span
                    className={`experience-duration${isCurrent ? ' experience-duration-current' : ''}`}
                  >
                    {exp.duration}
                  </span>
                </div>
                {exp.description && <p className="experience-description">{exp.description}</p>}
              </div>
            </li>
          );
        }),
      [experiences]
    );

    return (
      <Section
        id="experience"
        titleId="experience-heading"
        title={title}
        titleIcon={<Briefcase size={28} aria-hidden />}
        className="experience-section"
        titleClassName="experience-title"
        contentClassName="experience-content"
      >
        <ol className="experience-timeline" role="list">
          {items}
        </ol>
      </Section>
    );
  }
);
