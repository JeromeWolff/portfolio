import React from 'react';

import { Home } from './pages';
import '@styles/base/_global.scss';

const App: React.FC = () => {
  return <Home />;
};

export default React.memo(App);
