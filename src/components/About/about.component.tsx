import { User } from 'lucide-react';
import React, { useMemo } from 'react';

import { Section } from '../';

import { aboutConfig } from './about.config';
import { calculateAge } from './about.util';

export interface AboutSection {
  title: string;
  content: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface AboutProps {
  title?: string;
  sections?: AboutSection[];
  birthdate?: string;
}

export const About: React.FC<AboutProps> = React.memo(
  ({ title = 'About', sections = aboutConfig.sections, birthdate = aboutConfig.birthdate }) => {
    const age = useMemo(() => calculateAge(birthdate), [birthdate]);

    return (
      <Section
        id="about"
        titleId="about-heading"
        title={title}
        titleIcon={<User size={28} aria-hidden />}
        className="about-section"
        titleClassName="about-title"
        contentClassName="about-content"
      >
        <div className="about-bio">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <article key={idx} className="about-subsection">
                <h3 className="about-subsection-heading">
                  {Icon && <Icon size={18} aria-hidden className="about-subsection-icon" />}
                  {section.title}
                </h3>
                <p className="about-subsection-text">
                  {section.content.replace('{age}', age.toString())}
                </p>
              </article>
            );
          })}
        </div>
      </Section>
    );
  }
);
