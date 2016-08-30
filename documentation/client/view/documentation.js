import { DocumentationFiles } from '/documentation/collection/collection';

Template.documentation.onCreated(function () {
  const instance = this;

  // Run subscription in autorun
  instance.autorun(() => {
    // Get current documentation file Id
    const documentationFileId = Template.currentData().apiBackend.documentationFileId;

    if (documentationFileId) {
      // Subscribe to documentation
      instance.subscribe('singleDocumentationFile', documentationFileId);
    }
  });

  // Subscribe to code generator settings
  instance.subscribe('singleSetting', 'sdkCodeGenerator');
});

Template.documentation.onRendered(function () {
  $('[data-toggle="popover"]').popover();
});

Template.documentation.helpers({
  uploadedDocumentationLink: function () {
    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      // Current documentation file ID
      const currentDocumentationFileId = currentDocumentationFile._id;

      // Get documentation file URL
      return Meteor.absoluteUrl().slice(0, -1) + DocumentationFiles.baseURL + '/id/' + currentDocumentationFileId;
    }
  },
  documentationLink: function () {
    // get documentation link
    const documentationLink = this.apiBackend.documentation_link;
    // check if exists
    if (documentationLink) {
      return documentationLink;
    }
  },
  documentationExists: function () {
    const currentApiBackend = this.apiBackend;
    if (currentApiBackend.documentationFileId) {
      return true;
    }
  },
  codegenServerExists: function () {
    // Get template instance
    const instance = Template.instance();

    // Get documentation file
    const apiDocumentation = this.apiBackend.documentationFileId;

    // Get settings
    const settings = Settings.findOne();

    // Check documentation exists, generator is enabled and host setting exists
    if (settings && apiDocumentation && settings.sdkCodeGenerator.host && settings.sdkCodeGenerator.enabled) {
      // Get code generator host
      instance.codegenServer = settings.sdkCodeGenerator.host;

      // Generator is enabled and has host setting, return true
      return true;
    }
  }

});

Template.documentation.events({
  'click #manage-api-documentation' (event, instance) {
    // Get reference to API backend
    const apiBackend = instance.data.apiBackend;
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { apiBackend });
  },
  'click #sdk-code-generator' (event, instance) {
    // Get reference to API backend
    const apiBackend = instance.data.apiBackend;
    // Get reference to Code Generator host
    const host = instance.codegenServer;
    // Show the SDK Code generator form
    Modal.show('sdkCodeGeneratorModal', { apiBackend, host });
  }
});
