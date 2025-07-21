import { Card } from '@components/Card';
import { Section } from '@components/Section';
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

export const Experience: React.FC<ExperienceProps> = React.memo(
  ({ title = 'Experience', experiences = experienceConfig.experiences }) => {
    // Memoize experience cards to prevent recreating them on every render
    const experienceCards = useMemo(
      () => experiences.map((exp, idx) => <ExperienceCard key={idx} index={idx} {...exp} />),
      [experiences]
    );
    return (
      <Section
        title={title}
        className="experience-section"
        titleClassName="experience-title"
        contentClassName="experience-list"
      >
        {experienceCards}
      </Section>
    );
  }
);

interface ExperienceCardProps extends ExperienceItem {
  index: number;
}

// Regular expression compiled only once
const currentRegex = /heute|present|current/i;

const ExperienceCard: React.FC<ExperienceCardProps> = React.memo(
  ({ index: _index, role, company, duration, description }) => {
    // Memoize the current status check to prevent recalculating on every render
    const isCurrent = useMemo(() => currentRegex.test(duration), [duration]);
    // Memoize the class name to prevent string concatenation on every render
    const durationClassName = useMemo(
      () => `experience-duration${isCurrent ? ' current badge' : ''}`,
      [isCurrent]
    );

    return (
      <Card className="experience-card">
        <div className="experience-header">
          <span className="experience-role">{role}</span>
          <span className="experience-company">{company}</span>
        </div>
        <span className={durationClassName}>{duration}</span>
        {description && <p className="experience-description">{description}</p>}
      </Card>
    );
  }
);
