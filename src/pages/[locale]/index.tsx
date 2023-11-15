import React from "react";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";

const HomePage: React.FC<any> = () => {
  const {t} = useTranslation(['header', 'common', 'footer']);
  return (
    <div
      className="bg-gray-900 min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="text-white max-w-max">
        <main className="text-center">
          Home
        </main>
      </div>
    </div>
  );
}

export default HomePage;

const getStaticProps = makeStaticProps(["header", "common", "footer"])
export {getStaticPaths, getStaticProps}
