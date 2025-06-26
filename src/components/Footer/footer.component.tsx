import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { Component, ReactNode } from 'react';

import { classNames } from '../../helpers';

import { socialConfig } from './footer.config';

interface FooterContainerProps {
  children: ReactNode;
}

interface SocialLinkProps {
  label: string;
  href: string;
  icon: IconDefinition;
}

export class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <FooterInformationContainer />
        <SocialContainer />
        <CopyrightNotice />
      </FooterContainer>
    );
  }
}

class FooterContainer extends Component<FooterContainerProps> {
  render() {
    const { children } = this.props;
    return (
      <motion.footer
        className={classNames('py-6', 'mt-12')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto">{children}</div>
      </motion.footer>
    );
  }
}

class FooterInformationContainer extends Component {
  render() {
    return (
      <motion.div
        className={classNames('mb-4')}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FooterTitle />
        <FooterSubtext />
      </motion.div>
    );
  }
}

class FooterTitle extends Component {
  render() {
    return <h2 className={classNames('text-2xl', 'font-semibold')}>Get in Touch</h2>;
  }
}

class FooterSubtext extends Component {
  render() {
    return (
      <p>I'd love to hear from you! Feel free to reach out through any of the platforms below.</p>
    );
  }
}

class SocialContainer extends Component {
  render() {
    return (
      <motion.div
        className={classNames('flex', 'justify-center', 'space-x-6', 'mb-6')}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {socialConfig.socialLinks.map((socialLink, index) => (
          <SocialLink
            key={index}
            label={socialLink.label}
            href={socialLink.href}
            icon={socialLink.icon}
          />
        ))}
      </motion.div>
    );
  }
}

class SocialLink extends Component<SocialLinkProps> {
  render() {
    const { label, href, icon } = this.props;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={classNames('text-white', 'hover:text-gray-400')}
      >
        <FontAwesomeIcon icon={icon} size="lg" />
      </a>
    );
  }
}

class CopyrightNotice extends Component {
  render() {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Jerome Wolff. All rights reserved.
        </p>
      </motion.div>
    );
  }
}
