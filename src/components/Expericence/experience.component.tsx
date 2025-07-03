import { Card } from '@components/Card';
import { Section } from '@components/Section';
import React from 'react';

import { experienceConfig } from './experience.config';

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface ExperienceProps {
  title?: string;
  experiences?: ExperienceItem[];
}

export const Experience: React.FC<ExperienceProps> = ({
  title = 'Experience',
  experiences = experienceConfig.experiences,
}) => {
  return (
    <Section
      title={title}
      className="experience-section"
      titleClassName="experience-title"
      contentClassName="experience-list"
    >
      {experiences.map((exp, idx) => (
        <ExperienceCard key={idx} index={idx} {...exp} />
      ))}
    </Section>
  );
};

interface ExperienceCardProps extends ExperienceItem {
  index: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  index: _index,
  role,
  company,
  duration,
  description,
}) => {
  const isCurrent = /heute|present|current/i.test(duration);
  return (
    <Card className="experience-card">
      <div className="experience-header">
        <span className="experience-role">{role}</span>
        <span className="experience-company">{company}</span>
      </div>
      <span className={`experience-duration${isCurrent ? ' current badge' : ''}`}>{duration}</span>
      <p className="experience-description">{description}</p>
    </Card>
  );
};
