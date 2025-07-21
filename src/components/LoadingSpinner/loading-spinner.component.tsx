import { motion } from 'framer-motion';
import React from 'react';

type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({ size = 'md', color = 'primary', className = '' }) => {
    // Define size values
    const sizeValues = {
      sm: 24,
      md: 40,
      lg: 64,
    };
    const spinnerSize = sizeValues[size];
    // Animation for the spinner bars
    const barVariants = {
      initial: { opacity: 0.4, height: '60%' },
      animate: { opacity: 1, height: '100%' },
    };
    // Create an array of 3 bars with staggered animations
    const bars = Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        className={`loading-spinner-bar loading-spinner-bar-${color}`}
        initial="initial"
        animate="animate"
        variants={barVariants}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 0.8,
          delay: i * 0.2,
        }}
      />
    ));
    return (
      <div
        className={`loading-spinner loading-spinner-${size} ${className}`}
        style={{ width: spinnerSize, height: spinnerSize }}
        role="status"
        aria-label="Loading"
      >
        {bars}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

// LoadingFallback component that can be used with Suspense
export const LoadingFallback: React.FC = () => (
  <div className="loading-fallback">
    <LoadingSpinner />
    <p className="loading-text">Loading...</p>
  </div>
);
