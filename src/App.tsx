import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { LoadingFallback } from './components';
import '@styles/base/_global.scss';

const Home = lazy(() =>
  import('./pages/home.component').then((module) => ({ default: module.Home }))
);
const BlogListPage = lazy(() =>
  import('./pages/blog-list.component').then((module) => ({ default: module.BlogListPage }))
);
const BlogPostPage = lazy(() =>
  import('./pages/blog-post.component').then((module) => ({ default: module.BlogPostPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/not-found.component').then((module) => ({ default: module.NotFoundPage }))
);

const ScrollManager: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/tag/:tagSlug" element={<BlogListPage />} />
          <Route path="/blog/category/:categorySlug" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default React.memo(App);
