import { motion } from 'framer-motion';
import React, { Component, ReactNode } from 'react';

import { classNames } from '../../helpers';

interface ContainerProps {
  children: ReactNode;
}

export class Container extends Component<ContainerProps> {
  render() {
    const { children } = this.props;
    return (
      <motion.div
        className={classNames(
          'h-max',
          'bg-gradient-to-r',
          'from-emerald-500',
          'via-cyan-500',
          'to-blue-500',
          'bg-[length:200%_200%]'
        )}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <div className={classNames('container', 'mx-auto', 'text-center')}>{children}</div>
      </motion.div>
    );
  }
}
