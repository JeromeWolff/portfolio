import React from "react";
import {useTranslation} from "next-i18next"
import {getStaticPaths, makeStaticProps} from "@/helpers/getStatic";
import UseScrollToTop from "@/hooks/useScrollToTop";
import ContactForm from "@/components/form/ContactForm";

const namespaces = ["contact"];

const Contact: React.FC<any> = () => {
  const {t} = useTranslation(namespaces);
  return (
    <div className="bg-gray-900 min-h-full flex items-center justify-center">
      <div className="text-white w-full max-w-2xl text-center">
        <main>
          <ContactForm
            title={t("title")}
            fullNameLabel={t("full-name-label")}
            fullNamePlaceholderText={t("full-name-placeholder-text")}
            emailLabel={t("email-label")}
            emailPlaceHolderText={t("email-name-placeholder-text")}
            subjectLabel={t("subject-label")}
            subjectPlaceHolderText={t("subject-placeholder-text")}
            messageLabel={t("message-label")}
            sendMessageLabel={t("send-message-label")}
          />
          <UseScrollToTop/>
        </main>
      </div>
    </div>
  );
}

export default Contact;

const getStaticProps = makeStaticProps(namespaces);
export {getStaticPaths, getStaticProps}
