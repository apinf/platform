// Meteor packages imports
import { HTTP } from 'meteor/http';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import DocumentationFiles from '/documentation/collection';

// APINF imports
import specificLanguageNames from './codgeneratorSpecificLanguages';

Template.sdkCodeGeneratorModal.onCreated(function () {
  const instance = this;

  instance.callRequest = new ReactiveVar(false);
  instance.dataReady = new ReactiveVar(false);

  // Get documentation file id
  const documentationFileId = instance.data.api.documentationFileId;

  // Build documentation files base url
  const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);
  const documentationFilesBaseURL = meteorAbsoluteUrl + DocumentationFiles.baseURL;

  // Save documentation file URL
  instance.documentationFileURL = `${documentationFilesBaseURL}/id/${documentationFileId}`;

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
  generateSDK () {
     // Get reference to template instance
    const instance = Template.instance();

    // Create simple schema for sdk modal
    return new SimpleSchema({
      selectLanguage: {
        type: String,
        allowedValues: instance.languageList,
        autoform: {
          afFieldInput: {
            firstOption: '(Language)',
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
});
