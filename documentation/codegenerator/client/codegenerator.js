import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import _ from 'lodash';

import { DocumentationFiles } from '/documentation/collection/collection';
import { languageHashName } from './hashName'

Template.sdkCodeGeneratorModal.onCreated(function () {
  const instance = this;

  instance.callRequest = new ReactiveVar(false);
  instance.dataReady = new ReactiveVar(false);

  // Get documentation file id
  const documentationFileId = instance.data.apiBackend.documentationFileId;

  // Get documentation file URL
  const documentationFileURL = Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + '/id/' + documentationFileId;

  // Save documentation file URL
  instance.documentationFileURL = documentationFileURL;

  /* Get list of an available languages from Codegen server */

  // Codegen server url
  const url = 'https://generator.swagger.io/api/gen/clients';

  // Call GET request
  HTTP.get(url, {}, function (error, result) {
    // Get information from Swagger API response
    const response = JSON.parse(result.content);

    // Save response to use it like url parameter in POST request
    instance.urlParameters = response;

    // Create list of friendly language names
    instance.languageList = [];

    _.forEach(response, function (language) {
      // Check on specific name
      let newLanguageName = languageHashName[language];

      // Convert name by standard method if it isn't specific name
      if (_.isUndefined(newLanguageName)) {
        // Split the name into words, ex. 'akka-scala' -> 'akka','scala'
        let newLanguageList = language.split('-');
        // Do the capital letter for each word
        newLanguageList = _.map(newLanguageList, function (word) { return _.capitalize(word); });
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
    const sdkSchema = new SimpleSchema({
      selectLanguage: {
        type: String,
        allowedValues: instance.languageList,
        autoform: {
          afFieldInput: {
            firstOption: '(Language)'
          }
        }
      }
    });

    return sdkSchema;
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
    const dataToAutoform = {
      'apiBackend': instance.data.apiBackend,
      'callRequest': instance.callRequest,
      'documentationFileURL': instance.documentationFileURL,
      'languageList': instance.languageList,
      'urlParameters': instance.urlParameters
    };

    return dataToAutoform;
  }
});
