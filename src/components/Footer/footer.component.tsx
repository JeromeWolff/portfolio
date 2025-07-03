import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React from 'react';

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

export const Footer: React.FC<FooterProps> = ({
  title = 'Get in Touch',
  subtext = `I'd love to hear from you! Feel free to reach out through any of the platforms below.`,
  socials = socialConfig.socialLinks,
  copyright = `© ${new Date().getFullYear()} Jerome Wolff. All rights reserved.`,
}) => (
  <footer className="footer">
    <div className="footer__container">
      <motion.div
        className="footer__information"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="footer__information-title">{title}</h2>
        <p className="footer__information-subtext">{subtext}</p>
      </motion.div>
      <motion.div
        className="footer__social"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {socials.map((social, idx) => (
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
        ))}
      </motion.div>
      <motion.div
        className="footer__copyright"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p>{copyright}</p>
      </motion.div>
    </div>
  </footer>
);
