import React, {useEffect} from "react";
import Link from "next/link";
import Header from "@/components/header/Header";
import UseScrollToTop from "@/hooks/useScrollToTop";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import navLinks, {createNavLink} from "@/data/navLinks";

const namespaces = ["404", "common", "header", "footer"];

const Custom404: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  const localizedNavLinks = navLinks.map((link) => {
    return createNavLink(t("header:" + link.label), link.href, link.icon);
  });
  return <>
    <Header brand={t("header:brand")} navLinks={localizedNavLinks}/>
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-white max-w-max text-center">
        <main>
          <p className="text-4xl font-extrabold text-blue-600 sm:text-5xl">404</p>
          <div className="mt-6 sm:mt-8">
            <h1 className="text-4xl font-extrabold text-gray-200 tracking-tight sm:text-5xl">{t("title")}</h1>
            <p className="mt-3 text-base text-gray-300">{t("description")}</p>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-3">
            <Link href="/" className="button text-blue-600">
              <p>{t("common:back-to-home")}</p>
            </Link>
          </div>
          <UseScrollToTop />
        </main>
      </div>
    </div>
  </>;
}

export default Custom404;

const getStaticProps = makeStaticProps(namespaces)
export {getStaticPaths, getStaticProps}
