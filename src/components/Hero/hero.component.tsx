import { motion } from 'framer-motion';
import React, { Component } from 'react';

import { Button } from '../';

import { heroConfig } from './hero.config';

interface HeroProps {
  title?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export class Hero extends Component<HeroProps> {
  static defaultProps = {
    title: heroConfig.title,
    subtext: heroConfig.subtext,
    ctaLabel: heroConfig.ctaLabel,
    ctaHref: heroConfig.ctaHref,
  };

  render() {
    const { title, subtext, ctaLabel, ctaHref } = this.props;
    return (
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="hero-subtext"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {subtext}
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button as="a" href={ctaHref} variant="primary" size="lg">
              {ctaLabel}
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }
}
