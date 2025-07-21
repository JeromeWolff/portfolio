import React, { useMemo } from 'react';

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

export const About: React.FC<AboutProps> = React.memo(
  ({ title = 'About Me', sections = aboutConfig.sections, birthdate = aboutConfig.birthdate }) => {
    // Memoize age calculation to prevent recalculating on every render
    const age = useMemo(() => calculateAge(birthdate), [birthdate]);
    // Memoize section cards to prevent recreating them on every render
    const sectionCards = useMemo(
      () =>
        sections.map((section, idx) => (
          <AboutSectionCard
            key={idx}
            index={idx}
            title={section.title}
            content={section.content.replace('{age}', age.toString())}
          />
        )),
      [sections, age]
    );

    return (
      <Section
        title={title}
        className="about-section"
        titleClassName="about-title"
        contentClassName="about-sections"
      >
        {sectionCards}
      </Section>
    );
  }
);

interface AboutSectionCardProps {
  index: number;
  title: string;
  content: string;
}

const AboutSectionCard: React.FC<AboutSectionCardProps> = React.memo(
  ({ index, title, content }) => (
    <Card className="about-section-card" key={index}>
      <h3 className="about-section-title">{title}</h3>
      <div className="about-section-content">
        <p>{content}</p>
      </div>
    </Card>
  )
);
