import { motion } from 'framer-motion';
import React from 'react';

interface SectionProps {
  title: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
  titleDelay?: number;
  contentDelay?: number;
}

export const Section: React.FC<SectionProps> = ({
  title,
  className = '',
  titleClassName = '',
  contentClassName = '',
  children,
  titleDelay = 0.2,
  contentDelay = 0.4,
}) => (
  <section className={`app-section ${className}`}>
    <div className="section-content">
      <motion.h2
        className={`section-title ${titleClassName}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: titleDelay }}
      >
        {title}
      </motion.h2>
      <motion.div
        className={`section-children ${contentClassName}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: contentDelay }}
      >
        {children}
      </motion.div>
    </div>
  </section>
);
