import React from "react";
import Header from "@/components/header/Header";
import SocialLinks from "@/data/socialLinks";
import UseScrollToTop from "@/hooks/useScrollToTop";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import NavLinks, {createNavLink} from "@/data/navLinks";
import Link from "next/link";

const namespaces = ["home", "header"];

const Homepage: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  const localizedNavLinks = NavLinks.map((link) => {
    return createNavLink(t("header:" + link.label), link.href, link.icon);
  });
  return (
    <>
      <Header brand={t("header:brand")} navLinks={localizedNavLinks}/>
      <div className="bg-gray-900 min-h-full flex items-center justify-center">
        <div className="text-white max-w-prose text-center">
          <main>
            <h1 className="text-4xl font-extrabold text-blue-600 sm:text-5xl">{t("title")}</h1>
            <p className="mt-3 text-base text-gray-300 whitespace-pre-line">{t("description")}</p>
            <div className="mt-8 flex items-center justify-center space-x-3">
              {SocialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  as={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-500">
                  <span className="sr-only">{link.name}</span>
                  <link.icon className="h-8 w-8"/>
                </Link>
              ))}
            </div>
            <UseScrollToTop/>
          </main>
        </div>
      </div>
    </>
  );
}

export default Homepage;

const getStaticProps = makeStaticProps(namespaces);
export {getStaticPaths, getStaticProps}
