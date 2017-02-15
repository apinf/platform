// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import DocumentationFiles from '/documentation/collection';
import Settings from '/settings/collection';

Template.apiDocumentation.onCreated(function () {
  const instance = this;

  // Run subscription in autorun
  instance.autorun(() => {
    // Get current documentation file Id
    const documentationFileId = Template.currentData().api.documentationFileId;

    if (documentationFileId) {
      // Subscribe to documentation
      instance.subscribe('singleDocumentationFile', documentationFileId);
    }
  });

  // Subscribe to code generator settings
  instance.subscribe('singleSetting', 'sdkCodeGenerator');
});

Template.apiDocumentation.onRendered(() => {
  $('[data-toggle="popover"]').popover();
});

Template.apiDocumentation.helpers({
  uploadedDocumentationLink () {
    const documentationFileId = this.api.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    // Get documentation file Object
    const documentationFile = DocumentationFiles.findOne(objectId);

    let documentationFileUrl;

    // Check if documentation file is available
    if (documentationFile) {
      // Build documentation files base url
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);
      const documentationFilesBaseURL = meteorAbsoluteUrl + DocumentationFiles.baseURL;

      // Get documentation file URL
      documentationFileUrl = `${documentationFilesBaseURL}/id/${documentationFileId}`;
    }
    return documentationFileUrl;
  },
  documentationLink () {
    // get documentation link
    return this.api.documentation_link;
  },
  documentationExists () {
    return !!(this.api.documentationFileId);
  },
  codegenServerExists () {
    // Get template instance
    const instance = Template.instance();

    // Get settings
    const settings = Settings.findOne();

    let exists;
    // Check documentation exists, generator is enabled and host setting exists
    if (
      settings &&
      settings.sdkCodeGenerator &&
      settings.sdkCodeGenerator.host &&
      settings.sdkCodeGenerator.enabled
    ) {
      // Get code generator host
      instance.codegenServer = settings.sdkCodeGenerator.host;

      // Generator is enabled and has host setting, codegen server exists
      exists = true;
    }
    return exists;
  },

});

Template.apiDocumentation.events({
  'click #manage-api-documentation': function (event, templateInstance) {
    // Get reference to API backend
    const api = templateInstance.data.api;
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { api });
  },
  'click #sdk-code-generator': function (event, templateInstance) {
    // Get reference to API backend
    const api = templateInstance.data.api;
    // Get reference to Code Generator host
    const host = templateInstance.codegenServer;
    // Show the SDK Code generator form
    Modal.show('sdkCodeGeneratorModal', { api, host });
  },
});
