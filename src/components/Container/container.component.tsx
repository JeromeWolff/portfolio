import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Tag = 'div',
}) => {
  return (
    <Tag className={`container ${className}`.trim()} style={{ flex: 1 }}>
      {children}
    </Tag>
  );
};
