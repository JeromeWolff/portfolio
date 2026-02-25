import React from 'react';

/**
 * Semantic section with H2. Optional title icon (e.g. Lucide). CSS-only fade-in.
 */
interface SectionProps {
  id?: string;
  titleId?: string;
  title: string;
  titleIcon?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  titleId,
  title,
  titleIcon,
  className = '',
  titleClassName = '',
  contentClassName = '',
  children,
}) => (
  <section id={id} className={`app-section ${className}`} aria-labelledby={titleId ?? undefined}>
    <div className="section-content">
      <h2 id={titleId} className={`section-title ${titleClassName}`}>
        {titleIcon && (
          <span className="section-title-icon" aria-hidden>
            {titleIcon}
          </span>
        )}
        {title}
      </h2>
      <div className={`section-children ${contentClassName}`}>{children}</div>
    </div>
  </section>
);
