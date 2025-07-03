import React from 'react';

import { Card } from '../';
import { Section } from '../';

import { aboutConfig } from './about.config';
import { calculateAge } from './about.util';

export interface AboutSection {
  title: string;
  content: string;
}

interface AboutProps {
  title?: string;
  sections?: AboutSection[];
  birthdate?: string;
}

export const About: React.FC<AboutProps> = ({
  title = 'About Me',
  sections = aboutConfig.sections,
  birthdate = aboutConfig.birthdate,
}) => {
  const age = calculateAge(birthdate);
  return (
    <Section
      title={title}
      className="about-section"
      titleClassName="about-title"
      contentClassName="about-sections"
    >
      {sections.map((section, idx) => (
        <AboutSectionCard
          key={idx}
          index={idx}
          title={section.title}
          content={section.content.replace('{age}', age.toString())}
        />
      ))}
    </Section>
  );
};

interface AboutSectionCardProps {
  index: number;
  title: string;
  content: string;
}

const AboutSectionCard: React.FC<AboutSectionCardProps> = ({ index, title, content }) => (
  <Card className="about-section-card" key={index}>
    <h3 className="about-section-title">{title}</h3>
    <div className="about-section-content">
      <p>{content}</p>
    </div>
  </Card>
);
