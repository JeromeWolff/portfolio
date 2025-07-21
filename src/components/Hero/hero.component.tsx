import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '../';

import { heroConfig } from './hero.config';

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
    // Memoize animation variants to prevent recreating objects on each render
    const titleAnimation = React.useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2 },
      }),
      []
    );
    const subtextAnimation = React.useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.4 },
      }),
      []
    );
    const actionsAnimation = React.useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.6 },
      }),
      []
    );

    return (
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 className="hero-title" {...titleAnimation}>
            {title}
          </motion.h1>
          <motion.p className="hero-subtext" {...subtextAnimation}>
            {subtext}
          </motion.p>
          <motion.div className="hero-actions" {...actionsAnimation}>
            <Button as="a" href={ctaHref} variant="primary" size="lg">
              {ctaLabel}
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }
);
