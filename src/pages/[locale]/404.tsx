import React from "react";
import Link from "next/link";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";

const namespaces = ['404', 'common', 'footer'];

const Custom404: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  return (
    <div
      className="bg-gray-900 min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="text-white max-w-max">
        <main className="text-center">
          <p className="text-4xl font-extrabold text-blue-600 sm:text-5xl">404</p>
          <div className="mt-6 sm:mt-8 sm:flex sm:justify-center sm:items-center">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-gray-200 tracking-tight sm:text-5xl">{t("title")}</h1>
              <p className="mt-3 text-base text-gray-300">{t("description")}</p>
            </div>
            <div className="mt-8 flex space-x-3">
              <Link href="/" className="button text-blue-600">
                {t("common:back-to-home")}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Custom404;

const getStaticProps = makeStaticProps(namespaces)
export {getStaticPaths, getStaticProps}
