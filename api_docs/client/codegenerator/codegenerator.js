/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { HTTP } from 'meteor/http';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

// APINF imports
import specificLanguageNames from './codgeneratorSpecificLanguages';
import codeGeneratorLanguageOptions from './codeGeneratorLanguageOptions';

Template.sdkCodeGeneratorModal.onCreated(function () {
  const instance = this;

  instance.callRequest = new ReactiveVar(false);
  instance.dataReady = new ReactiveVar(false);

  // Get documentation url
  instance.documentationUrl = instance.data.api.documentation();

  /* Get list of an available languages from Codegen server */

  // Codegen server url
  const url = 'https://generator.swagger.io/api/gen/clients';

  // Call GET request
  HTTP.get(url, {}, (error, result) => {
    // Get information from Swagger API response
    const response = JSON.parse(result.content);

    // Save response to use it like url parameter in POST request
    instance.urlParameters = response;

    // Create list of friendly language names
    instance.languageList = [];

    _.forEach(response, (language) => {
      // Check on specific name
      let newLanguageName = specificLanguageNames[language];

      // Convert name by standard method if it isn't specific name
      if (_.isUndefined(newLanguageName)) {
        // Split the name into words, ex. 'akka-scala' -> 'akka','scala'
        let newLanguageList = language.split('-');
        // Do the capital letter for each word
        newLanguageList = _.map(newLanguageList, (word) => { return _.capitalize(word); });
        // Join this list to string using space
        newLanguageName = newLanguageList.join(' ');
      }
      // Add new name to list of languages which show to user
      instance.languageList.push(newLanguageName);

      // Finish spinner
      instance.dataReady.set(true);
    });
  });
});

Template.sdkCodeGeneratorModal.helpers({
  // Schema for SDK Code Generator form
  codeGeneratorSchema () {
    // Create simple schema for sdk modal
    return new SimpleSchema({
      selectLanguage: {
        label: TAPi18n.__('sdkCodeGeneratorModal_labelText_selectLanguage'),
        type: String,
        autoform: {
          afFieldInput: {
            firstOption: TAPi18n.__('sdkCodeGeneratorModal_firstOption_language'),
          },
          options () {
            return codeGeneratorLanguageOptions;
          },
        },
      },
    });
  },
  // Check on ready of data from call GET request
  dataFetched () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.dataReady.get();
  },
  // Give variable callRequest to template
  statusRequest () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.callRequest.get();
  },
  // From template AutoForm we don't have access to instance of this template
  // getTemplateInstance return object that containts the necessary varaibles
  getTemplateInstance () {
    // Get reference to template instance
    const instance = Template.instance();

    // Create object with instance varaibles
    return {
      codegenServer: instance.data.host,
      callRequest: instance.callRequest,
      documentationFileURL: instance.documentationFileURL,
      languageList: instance.languageList,
      urlParameters: instance.urlParameters,
    };
  },
  buttonText () {
    // Return button text depending on language
    return TAPi18n.__('sdkCodeGeneratorModal_buttonText_download');
  },
});
