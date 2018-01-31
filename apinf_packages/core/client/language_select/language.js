/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

// Npm packages imports
import _ from 'lodash';

import '/apinf_packages/core/client/language_select/language.html';

// eslint-disable-next-line prefer-arrow-callback
Template.languageSelect.onCreated(function () {
  // Get saved language
  const selectedLanguage = Session.get('lang');

  // If language was selected before
  if (selectedLanguage) {
    // Update site language with selected language
    TAPi18n.setLanguage(selectedLanguage);
    T9n.setLanguage(selectedLanguage);
  } else {
    // Set English by default value
    Session.setDefaultPersistent('lang', 'en');
  }
});

Template.languageSelect.helpers({
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

    // Add class "selected" to highlight active language
    if (activeLanguage === languageTag) {
      return 'selected';
    }
    return '';
  },
});

Template.languageSelect.events({
  'change #language-select': (event) => {
    // Get language from the current data context
    const language = event.target.value;

    // Update selected language in Session
    Session.update('lang', language);

    // Update site language with selected language
    TAPi18n.setLanguage(language);
    T9n.setLanguage(language);
  },
});
