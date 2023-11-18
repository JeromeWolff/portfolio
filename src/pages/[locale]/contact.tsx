import React from "react";
import Header from "@/components/header/Header";
import UseScrollToTop from "@/hooks/useScrollToTop";
import ContactForm from "@/components/form/ContactForm";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import navLinks, {createNavLink} from "@/data/navLinks";

const namespaces = ["contact", "header"];

const Contact: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  const localizedNavLinks = navLinks.map((link) => {
    return createNavLink(t("header:" + link.label), link.href, link.icon);
  });
  return (
    <>
      <Header brand={t("header:brand")} navLinks={localizedNavLinks}/>
      <div className="p-4 sm:p-6 bg-gray-900 min-h-full flex items-center justify-center">
        <div className="text-white w-full max-w-2xl text-center">
          <main>
            <ContactForm
              title={t("title")}
              fullNameLabel={t("full-name-label")}
              fullNamePlaceholderText={t("full-name-placeholder-text")}
              emailLabel={t("email-label")}
              emailPlaceHolderText={t("email-placeholder-text")}
              subjectLabel={t("subject-label")}
              subjectPlaceHolderText={t("subject-placeholder-text")}
              messageLabel={t("message-label")}
              sendMessageLabel={t("send-message-label")}
            />
            <UseScrollToTop/>
          </main>
        </div>
      </div>
    </>
  );
}

export default Contact;

const getStaticProps = makeStaticProps(namespaces);
export {getStaticPaths, getStaticProps}
