import React, {useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import languageDetector from './languageDetector';

export const useRedirect = (to?: string) => {
  const router = useRouter();
  useEffect(() => handleRouting(router, to), [router, to]);
  return <></>;
};

function handleRouting(router: NextRouter, to?: string) {
  const target = to || router.asPath;
  const detectedLanguage = languageDetector.detect();
  if (detectedLanguage) {
    languageDetector.cache!(detectedLanguage);
    replaceRouting(router, target, detectedLanguage);
  }
}

function findRedirectPath(router: NextRouter, target: string, detectedLanguage: string) {
  const languagePath = "/" + detectedLanguage;
  let redirectPath = "";
  if (!target.startsWith(languagePath)) {
    redirectPath += languagePath;
  }
  redirectPath += router.isFallback || (router.query && router.query.error === "404") ? "/404" : target;
  return redirectPath;
}

function replaceRouting(router: NextRouter, target: string, detectedLanguage: string) {
  const redirectPath = findRedirectPath(router, target, detectedLanguage);
  if (router.asPath !== redirectPath) {
    router.replace(redirectPath);
  }
}

export const Redirect = () => {
  useRedirect();
  return <></>;
};

// eslint-disable-next-line react/display-name
export const getRedirect = (to: string) => () => {
  if (!to.startsWith("/")) {
    to = "/" + to;
  }
  useRedirect(to);
  return <></>;
};

export default Redirect;