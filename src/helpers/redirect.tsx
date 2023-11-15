import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import languageDetector from './languageDetector';

export const useRedirect = (to?: string) => {
  const router = useRouter();
  const detectedLanguage = languageDetector.detect();
  useEffect(() => {
    const target = to || router.asPath;
    if (detectedLanguage) {
      const languagePath = '/' + detectedLanguage;
      let redirectPath = '';
      if (!target.startsWith(languagePath)) {
        redirectPath += languagePath;
      }
      redirectPath += router.isFallback || (router.query && router.query.error === '404') ? router.route : target;
      languageDetector.cache!(detectedLanguage);
      console.log(detectedLanguage);
      console.log(redirectPath);
      if (router.asPath !== redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [detectedLanguage, router, to]);

  return <></>;
};

export const Redirect = () => {
  useRedirect();
  return <></>;
};

// eslint-disable-next-line react/display-name
export const getRedirect = (to: string) => () => {
  useRedirect(to);
  return <></>;
};

export default Redirect;