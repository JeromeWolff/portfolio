import React, { Suspense, lazy } from 'react';

import { Header, Hero, LoadingFallback } from '../components';

const About = lazy(() =>
  import('../components/About/about.component').then((module) => ({ default: module.About }))
);
const Skills = lazy(() =>
  import('../components/Skills/skills.component').then((module) => ({ default: module.Skills }))
);
const Projects = lazy(() =>
  import('../components/Projects/projects.component').then((module) => ({
    default: module.Projects,
  }))
);
const Experience = lazy(() =>
  import('../components/Expericence/experience.component').then((module) => ({
    default: module.Experience,
  }))
);
const Footer = lazy(() =>
  import('../components/Footer/footer.component').then((module) => ({ default: module.Footer }))
);

/**
 * Semantic layout: skip link (a11y), header/nav, main with sections in SEO-friendly order.
 * Hero is critical for LCP; below-the-fold sections lazy-loaded.
 */
export const Home: React.FC = React.memo(() => {
  return (
    <>
      {/* A11y: skip to main content for keyboard users */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <About />
          <Skills />
          <Projects />
          <Experience />
        </Suspense>
      </main>
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </>
  );
});
