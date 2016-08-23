import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { DocumentationFiles } from '/documentation/collection/collection';

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
    const sdkSchema = new SimpleSchema({
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
