import React, { useMemo } from 'react';

import { socialConfig } from './footer.config';

import type { LucideIcon } from 'lucide-react';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface FooterProps {
  title?: string;
  subtext?: string;
  socials?: SocialLink[];
  copyright?: string;
}

/**
 * Contact section: semantic footer with id="contact" for nav CTA.
 * Icons: Lucide (tree-shakeable).
 */
export const Footer: React.FC<FooterProps> = React.memo(
  ({
    title = 'Get in Touch',
    subtext = `I'd love to hear from you! Reach out via the links below.`,
    socials = socialConfig.socialLinks,
    copyright,
  }) => {
    const copyrightText = useMemo(
      () => copyright || `© ${new Date().getFullYear()} Jerome Wolff. All rights reserved.`,
      [copyright]
    );
    const socialLinks = useMemo(
      () =>
        socials.map((social, idx) => {
          const Icon = social.icon;
          return (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="footer-social-link"
            >
              <Icon size={20} aria-hidden />
            </a>
          );
        }),
      [socials]
    );

    return (
      <footer id="contact" className="footer" role="contentinfo" aria-labelledby="contact-heading">
        <div className="footer-container">
          <div className="footer-information">
            <h2 id="contact-heading" className="footer-information-title">
              {title}
            </h2>
            <p className="footer-information-subtext">{subtext}</p>
          </div>
          <div className="footer-social">{socialLinks}</div>
          <div className="footer-copyright">
            <p>{copyrightText}</p>
          </div>
        </div>
      </footer>
    );
  }
);
