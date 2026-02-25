import React from 'react';

type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: string;
  className?: string;
}

/**
 * CSS-only spinner for Suspense fallback - no animation library.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({ size = 'md', color = 'primary', className = '' }) => (
    <div
      className={`loading-spinner loading-spinner-${size} loading-spinner-${color} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
);

export const LoadingFallback: React.FC = () => (
  <div className="loading-fallback">
    <LoadingSpinner />
    <p className="loading-text">Loading...</p>
  </div>
);
