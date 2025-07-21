import React, { Suspense, lazy } from 'react';

import { Container, Hero, LoadingFallback } from '../components';

// Lazy load components that are not needed for initial render
const About = lazy(() =>
  import('../components/About/about.component').then((module) => ({ default: module.About }))
);
const Experience = lazy(() =>
  import('../components/Expericence/experience.component').then((module) => ({
    default: module.Experience,
  }))
);
const Footer = lazy(() =>
  import('../components/Footer/footer.component').then((module) => ({ default: module.Footer }))
);

export const Home: React.FC = React.memo(() => {
  return (
    <>
      <Container>
        <main>
          {/* Hero is critical for first render, so not lazy loaded */}
          <Hero />
          {/* Wrap lazy-loaded components in Suspense */}
          <Suspense fallback={<LoadingFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Experience />
          </Suspense>
        </main>
      </Container>

      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </>
  );
});
