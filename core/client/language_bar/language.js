// Meteor packages imports
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

// eslint-disable-next-line prefer-arrow-callback
Template.languageBar.onCreated(function () {
  // Get saved language
  const selectedLanguage = Session.get('lang');

  // If language was selected before
  if (selectedLanguage) {
    // Update site language with selected language
    TAPi18n.setLanguage(selectedLanguage);
  } else {
    // Set English by default value
    Session.setDefaultPersistent('lang', 'en');
  }
});

Template.languageBar.helpers({
  languagesList () {
    // This helper converts the languages object into an array of objects
    // TODO: determine if there is a simpler way to perform these steps

    // Placeholder for language options
    const languageOptions = [];

    // Get all site translation languages
    const languages = TAPi18n.getLanguages();

    // Create Array of Objects with language tag and name
    _.forEach(languages, (language, tag) => {
      // Get language object
      const languageOption = language;

      // Get language tag (short language name)
      languageOption.tag = tag;

      // Add language option to array
      languageOptions.push(languageOption);
    });

    return languageOptions;
  },
  activeLanguage () {
    // Get current language
    const activeLanguage = Session.get('lang');

    // Get language from the current data context
    const languageTag = this.tag;

    // Add class "active" to highlight active language
    if (activeLanguage === languageTag) {
      return 'active';
    }
    return '';
  },
});

Template.languageBar.events({
  // eslint-disable-next-line prefer-arrow-callback
  'click .language-option': function () {
    // Get language from the current data context
    const language = this.tag;

    // Update selected language in Session
    Session.update('lang', language);

    // Update site language with selected language
    TAPi18n.setLanguage(language);
  },
});
