import { motion } from 'framer-motion';
import React, { Component, ReactNode } from 'react';

import { classNames, format } from '../../helpers';

import { aboutConfig } from './about.config';
import { calculateAge } from './about.util';

interface AboutContainerProps {
  children: ReactNode;
}

interface AboutSectionProps {
  index: number;
  age?: number;
  title: string;
  content: string;
}

export class About extends Component {
  render() {
    return (
      <AboutContainer>
        <AboutTitle />
        <AboutContent />
      </AboutContainer>
    );
  }
}

class AboutContainer extends Component<AboutContainerProps> {
  render() {
    const { children } = this.props;
    return (
      <motion.div
        className={classNames('flex', 'flex-col', 'items-center', 'justify-center', 'p-8')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    );
  }
}

class AboutTitle extends Component {
  render() {
    return (
      <motion.h2
        className={classNames('text-4xl', 'text-white', 'font-bold', 'mb-6')}
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.3 }}
      >
        About Me
      </motion.h2>
    );
  }
}

class AboutContent extends Component {
  render() {
    const age = calculateAge(aboutConfig.birthdate);
    return (
      <div className={classNames('relative', 'space-y-8', 'max-w-4xl', 'w-full')}>
        {aboutConfig.sections.map((section, index) => (
          <AboutSection
            key={index}
            index={index}
            age={age}
            title={section.title}
            content={section.content}
          />
        ))}
        <AboutTimelineline />
      </div>
    );
  }
}

class AboutSection extends Component<AboutSectionProps> {
  render() {
    const { index, age, title, content } = this.props;
    return (
      <motion.div
        key={index}
        className={classNames(
          'relative',
          'pl-10',
          'pr-6',
          'py-4',
          'bg-gray-800',
          'rounded-lg',
          'shadow-lg',
          'max-w-3xl',
          'mx-auto',
          'hover:bg-gray-700',
          'hover:scale-105',
          'transition-transform',
          'duration-300',
          'ease-in-out'
        )}
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.2 }}
      >
        <div
          className={classNames(
            'absolute',
            '-left-5',
            'top-4',
            'w-8',
            'h-8',
            'bg-gray-700',
            'rounded-full'
          )}
        />
        <h3 className={classNames('text-2xl', 'font-semibold', 'text-white')}>{title}</h3>
        <p className={classNames('mt-4', 'text-gray-300')}>{format(content, age)}</p>
      </motion.div>
    );
  }
}

class AboutTimelineline extends Component {
  render() {
    return (
      <div
        className={classNames(
          'absolute',
          'left-2',
          'top-0',
          'h-full',
          'w-1',
          'bg-gray-700',
          'rounded-full'
        )}
      />
    );
  }
}
