import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Semantic element (e.g. article for project cards). */
  as?: 'div' | 'article' | 'section';
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  as: Tag = 'div',
}) => (
  <Tag className={`app-card ${className}`} onClick={onClick}>
    {children}
  </Tag>
);
