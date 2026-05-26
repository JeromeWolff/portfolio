import { Compass } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Footer, Header, Section, Seo } from '../components';

export const NotFoundPage: React.FC = React.memo(() => {
  return (
    <>
      <Seo
        title="Page not found | Jerome Wolff"
        description="The requested page could not be found."
        path="/"
        noindex
      />
      <Header />
      <main id="main">
        <Section
          id="not-found"
          titleId="not-found-heading"
          title="Page not found"
          titleIcon={<Compass size={28} aria-hidden />}
          className="app-section"
        >
          <p>The page you requested could not be found.</p>
          <Link to="/" className="btn btn-primary">
            Back home
          </Link>
        </Section>
      </main>
      <Footer />
    </>
  );
});
