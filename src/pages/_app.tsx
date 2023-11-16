import type {AppProps} from "next/app";
import React, {useEffect} from "react";
import NextNProgress from "nextjs-progressbar";
import SEO from '@/../next-seo.config';
import i18nextConfig from '../../next-i18next.config';
import {useRouter} from "next/router";
import {appWithTranslation, useTranslation} from "next-i18next";
import {DefaultSeo} from "next-seo";
import {GoogleAnalytics} from "nextjs-google-analytics";
import '@/styles/globals.css';
import '@/styles/prism.css';

const App = ({Component, pageProps}: AppProps) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    i18n.changeLanguage(router.locale);
  }, [router.locale]);
  return <>
    <DefaultSeo {...SEO} />
    <GoogleAnalytics trackPageViews/>
    <NextNProgress color="#3B91F6"/>
    <Component {...pageProps} />
  </>
}

export default appWithTranslation(App, i18nextConfig);
