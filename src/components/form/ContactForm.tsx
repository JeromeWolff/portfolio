import React from "react";
import FormInput from "@/components/form/FormInput";

interface ContactFormProps {
  title: string;
  fullNameLabel: string;
  fullNamePlaceholderText: string;
  emailLabel: string;
  emailPlaceHolderText: string;
  subjectLabel: string;
  subjectPlaceHolderText: string;
  messageLabel: string;
  sendMessageLabel: string;
}

const ContactForm: React.FC<ContactFormProps> = (props: ContactFormProps) => {
  return (
    <div className="w-full">
      <div className="leading-loose">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full m-4 p-4 sm:p-6 bg-gray-900 dark:bg-gray-800 rounded-xl shadow-xl text-left">
          <p className="mb-4 sm:mb-8 font-extrabold text-center text-blue-600 dark:text-white text-2xl">{props.title}</p>
          <FormInput
            inputLabel={props.fullNameLabel}
            labelFor="name"
            inputType="text"
            inputId="name"
            inputName="name"
            placeholderText={props.fullNamePlaceholderText}
            ariaLabelName={props.fullNameLabel}
          />
          <FormInput
            inputLabel={props.emailLabel}
            labelFor="email"
            inputType="email"
            inputId="email"
            inputName="email"
            placeholderText={props.fullNamePlaceholderText}
            ariaLabelName={props.emailLabel}
          />
          <FormInput
            inputLabel={props.subjectLabel}
            labelFor="subject"
            inputType="text"
            inputId="subject"
            inputName="subject"
            placeholderText={props.subjectPlaceHolderText}
            ariaLabelName={props.subjectLabel}
          />
          <div className="mt-6">
            <label className="block text-lg text-blue-600 dark:text-white mb-2" htmlFor="message">{props.messageLabel}</label>
            <textarea
              className="w-full px-5 py-2 border border-blue-600 dark:border-white border-opacity-50 text-blue-600 dark:text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-sm text-md"
              id="message"
              name="message"
              cols={14}
              rows={6}
              aria-label={props.messageLabel}
            ></textarea>
          </div>
          <div className="mt-6">
            <span
              className="w-full mt-6 px-7 py-4 block text-white text-center font-extrabold tracking-wider bg-blue-600 hover:bg-blue-700 focus:ring-1 focus:ring-blue-900 rounded-lg duration-500">
              <button title={props.sendMessageLabel} type="submit" aria-label={props.sendMessageLabel}>{props.sendMessageLabel}</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;