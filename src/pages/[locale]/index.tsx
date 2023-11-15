import React from "react";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import SocialLinks from "@/data/socialLinks";

const namespaces = ["home"];

const Homepage: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  return (
    <div className="bg-gray-900 min-h-full flex items-center justify-center">
      <div className="text-white max-w-prose text-center">
        <main>
          <h1 className="text-4xl font-extrabold text-blue-600 sm:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-base text-gray-300 whitespace-pre-line">{t("description")}</p>
          <div className="mt-8 flex items-center justify-center space-x-3">
            {SocialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
                <span className="sr-only">{link.name}</span>
                <link.icon className="h-8 w-8"/>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Homepage;

const getStaticProps = makeStaticProps(namespaces);
export {getStaticPaths, getStaticProps}
