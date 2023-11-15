import languageDetector from 'next-language-detector'
import i18nextConfig from '../../next-i18next.config'

const options = {
  fallbackLng: i18nextConfig.i18n.defaultLocale,
  supportedLngs: i18nextConfig.i18n.locales,
};

export default languageDetector(options)
