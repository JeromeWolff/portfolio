import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

import { socialConfig } from './footer.config';

export interface SocialLink {
  label: string;
  href: string;
  icon: IconDefinition;
}

interface FooterProps {
  title?: string;
  subtext?: string;
  socials?: SocialLink[];
  copyright?: string;
}

export const Footer: React.FC<FooterProps> = React.memo(
  ({
    title = 'Get in Touch',
    subtext = `I'd love to hear from you! Feel free to reach out through any of the platforms below.`,
    socials = socialConfig.socialLinks,
    copyright,
  }) => {
    // Memoize the copyright text to prevent recalculating on every render
    const copyrightText = useMemo(
      () => copyright || `© ${new Date().getFullYear()} Jerome Wolff. All rights reserved.`,
      [copyright]
    );
    // Memoize animation variants to prevent recreating objects on each render
    const infoAnimation = useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.3 },
      }),
      []
    );
    const socialAnimation = useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.6 },
      }),
      []
    );
    const copyrightAnimation = useMemo(
      () => ({
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.9 },
      }),
      []
    );
    // Memoize social links to prevent recreating them on every render
    const socialLinks = useMemo(
      () =>
        socials.map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="footer__social-link"
          >
            <FontAwesomeIcon icon={social.icon} size="lg" />
          </a>
        )),
      [socials]
    );

    return (
      <footer className="footer">
        <div className="footer__container">
          <motion.div className="footer__information" {...infoAnimation}>
            <h2 className="footer__information-title">{title}</h2>
            <p className="footer__information-subtext">{subtext}</p>
          </motion.div>
          <motion.div className="footer__social" {...socialAnimation}>
            {socialLinks}
          </motion.div>
          <motion.div className="footer__copyright" {...copyrightAnimation}>
            <p>{copyrightText}</p>
          </motion.div>
        </div>
      </footer>
    );
  }
);
