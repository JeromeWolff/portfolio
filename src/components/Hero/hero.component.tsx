import { motion } from 'framer-motion';
import React, { Component, ReactNode } from 'react';

import { classNames } from '../../helpers';

import { heroConfig } from './hero.config';

interface HeroContainerProps {
  children: ReactNode;
}

export class Hero extends Component {
  render() {
    return (
      <HeroContainer>
        <HeroTitle />
        <HeroSubtext />
      </HeroContainer>
    );
  }
}

class HeroContainer extends Component<HeroContainerProps> {
  render() {
    const { children } = this.props;
    return (
      <motion.div
        className={classNames('h-screen', 'flex', 'items-center', 'justify-center')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div>{children}</div>
      </motion.div>
    );
  }
}

class HeroTitle extends Component {
  render() {
    return (
      <motion.h1
        className={classNames('text-5xl', 'font-bold')}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {heroConfig.title}
      </motion.h1>
    );
  }
}

class HeroSubtext extends Component {
  render() {
    return (
      <motion.p
        className={classNames('text-xl', 'mt-4')}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {heroConfig.subtext}
      </motion.p>
    );
  }
}
