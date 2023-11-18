import React from "react";
import Header from "@/components/header/Header";
import SocialLinks from "@/data/socialLinks";
import NavLinks, {createNavLink} from "@/data/navLinks";
import UseScrollToTop from "@/hooks/useScrollToTop";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import SocialLinksContainer
  from "@/components/socialmedia/SocialLinksContainer";
import socialLinks from "@/data/socialLinks";

const namespaces = ["home", "header"];

const Homepage: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  const localizedNavLinks = NavLinks.map((link) => {
    return createNavLink(t("header:" + link.label), link.href, link.icon);
  });
  return <>
    <Header brand={t("header:brand")} navLinks={localizedNavLinks}/>
    <div
      className="p-4 sm:p-6 bg-gray-900 min-h-full flex items-center justify-center">
      <div className="text-white max-w-prose text-center">
        <main>
          <h1
            className="text-4xl font-extrabold text-blue-600 sm:text-5xl">{t("title")}</h1>
          <p
            className="mt-3 text-base text-gray-300 whitespace-pre-line">{t("description")}</p>
          <SocialLinksContainer socialLinks={socialLinks} />
          <UseScrollToTop/>
        </main>
      </div>
    </div>
  </>;
}

export default Homepage;

const getStaticProps = makeStaticProps(namespaces);
export {getStaticPaths, getStaticProps}
