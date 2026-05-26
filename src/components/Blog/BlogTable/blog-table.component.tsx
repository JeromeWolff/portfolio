import React from 'react';

interface BlogTableProps {
  children: React.ReactNode;
}

export const BlogTable: React.FC<BlogTableProps> = React.memo(({ children }) => {
  return (
    <div className="blog-table" role="region" aria-label="Scrollable table">
      <table>{children}</table>
    </div>
  );
});
