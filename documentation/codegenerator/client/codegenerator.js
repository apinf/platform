import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';

import { LanguageParams, LanguageList, DocumentationFiles } from '/documentation/collection/collection';

Template.sdkCodeGeneratorModal.onCreated(function () {
  const instance = this;

  instance.callRequest = new ReactiveVar(false);

  instance.autorun(function () {
    // Get documentation file id
    const documentationFileId = instance.data.apiBackend.documentationFileId;

    // Get documentation file URL
    const documentationFileURL = Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + '/id/' + documentationFileId;

    // Save documentation file URL
    Session.set('currentDocumentationFileURL', documentationFileURL);
  });
});

Template.sdkCodeGeneratorModal.onDestroyed(function () {
  // Unset session
  Session.set('currentDocumentationFileURL', undefined);
});

Template.sdkCodeGeneratorModal.helpers({
  // Schema for SDK Code Generator form
  generateSDK () {
    var sdkSchema = new SimpleSchema({
      selectLanguage: {
        type: String,
        allowedValues: LanguageList,
        autoform: {
          afFieldInput: {
            firstOption: '(Language)'
          }
        }
      }
    });
    return sdkSchema;
  },

  // Give variable callRequest to template
  statusRequest () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.callRequest.get();
  },
  // Give variable callRequest to autoform as a parameter
  getCallRequest () {
    // Get reference to template instance
    const instance = Template.instance();

    return instance.callRequest;
  }

});

AutoForm.addHooks('downloadSDK', {
  onSubmit: function (formValues, updateDoc, callRequest) {
    // Prevent form from submitting
    this.event.preventDefault();

    // Get selected language from dropdown
    const selectedLanguage = formValues.selectLanguage;

    // Create parameter for URL on depecing selected language
    // Check on specific language name
    let languageHashName = LanguageParams[selectedLanguage];

    if (_.isUndefined(languageHashName)) {
        // Use standart method for creating parameter
      languageHashName = selectedLanguage.toLowerCase();
      languageHashName = languageHashName.replace(/\s+/g, '-');
    }

    // Create URL to send request
    const url = 'https://generator.swagger.io/api/gen/clients/' + languageHashName;

    // Get path to documentation file
    const pathToFile = Session.get('currentDocumentationFileURL');

    // Create POST options
    const options = {
      'swaggerUrl': pathToFile
    };

    // Start spinner when send request
    callRequest.set(true);

    // Send POST request
    HTTP.post(url, { data: options }, function (error, result) {
      // Get information from Swagger API response
      let response = JSON.parse(result.content);

      if (result.statusCode === 200) {
        // Hide modal
        Modal.hide('sdkCodeGeneratorModal');

        // Go to link and download file
        window.location.href = response.link;
      } else {
        $('button').removeAttr('disabled');

        // Otherwise show an error message
        FlashMessages.sendError(response.message);
      }
      // Finish spinner
      callRequest.set(false);
    });
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
