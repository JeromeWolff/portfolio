import React from 'react';

interface BlogImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string;
}

export const BlogImage: React.FC<BlogImageProps> = React.memo(
  ({ caption, alt = '', className = '', loading = 'lazy', decoding = 'async', ...rest }) => {
    return (
      <figure className={`blog-image ${className}`.trim()}>
        <img alt={alt} loading={loading} decoding={decoding} {...rest} />
        {caption ? <figcaption className="blog-image-caption">{caption}</figcaption> : null}
      </figure>
    );
  }
);
