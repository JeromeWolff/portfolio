import { ArrowRight } from 'lucide-react';
import React from 'react';

import { Button } from '../';

import { heroConfig } from './hero.config';

/**
 * Hero: single H1 for SEO, immediate clarity on who and what.
 * Animations: CSS-only for performance (no framer-motion here).
 */
interface HeroProps {
  title?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const Hero: React.FC<HeroProps> = React.memo(
  ({
    title = heroConfig.title,
    subtext = heroConfig.subtext,
    ctaLabel = heroConfig.ctaLabel,
    ctaHref = heroConfig.ctaHref,
  }) => {
    return (
      <section id="hero" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title" className="hero-title">
            {title}
          </h1>
          <p className="hero-subtext">{subtext}</p>
          <div className="hero-actions">
            <Button as="a" href={ctaHref} variant="primary" size="lg" className="hero-cta">
              <span>{ctaLabel}</span>
              <ArrowRight size={18} aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    );
  }
);
