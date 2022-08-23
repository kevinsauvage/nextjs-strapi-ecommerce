const es = require('../locales/es.json');
const en = require('../locales/en.json');
const fr = require('../locales/fr.json');

const messages = {
  es,
  en,
  fr,
};

const i18nNextConfig = {
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en',
  },
};

module.exports = { i18nNextConfig, messages };
