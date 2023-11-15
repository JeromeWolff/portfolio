const ChainedBackend = require('i18next-chained-backend').default;
const LocalStorageBackend = require('i18next-localstorage-backend').default;
const isBrowser = typeof window !== 'undefined';
const path = !isBrowser ? require('path') : false;
const localePath = path !== false ? `${path.resolve('./public/locales')}/` : 'locales';

const config= {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
  },
  localePath: localePath,
  backend: {
    backendOptions: [
      {
        expirationTime: 60 * 60 * 1000,
      },
    ],
    //loadPath: `${localePath}{{lng}}/{{ns}}.json`,
    backends: typeof window !== 'undefined' ? [LocalStorageBackend] : [],
  },
  serializeConfig: false,
  use: isBrowser ? [ChainedBackend] : [],
};

module.exports = config;
