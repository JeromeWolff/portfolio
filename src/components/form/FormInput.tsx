import React from 'react';

interface FormInputProps {
  inputLabel: string;
  labelFor: string;
  inputType: string;
  inputId: string;
  inputName: string;
  placeholderText: string;
  ariaLabelName: string;
}

const FormInput: React.FC<FormInputProps> = ({
                                               inputLabel,
                                               labelFor,
                                               inputType,
                                               inputId,
                                               inputName,
                                               placeholderText,
                                               ariaLabelName,
                                             }: FormInputProps) => {
  return (
    <div className="mb-4">
      <label
        className="block text-lg text-blue-600 dark:text-white mb-1"
        htmlFor={labelFor}>{inputLabel}</label>
      <input
        className="w-full px-5 py-2 border border-blue-600 dark:border-white border-opacity-50 text-blue-600 dark:text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-sm text-md"
        type={inputType}
        id={inputId}
        name={inputName}
        placeholder={placeholderText}
        aria-label={ariaLabelName}
        required
      />
    </div>
  );
};

export default FormInput;