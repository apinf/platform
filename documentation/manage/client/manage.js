import { DocumentationFiles } from '/documentation/collection/collection';

Template.manageApiDocumentationModal.onCreated(function () {
  const instance = this;

  // Subscribe to documentation
  Meteor.subscribe('allDocumentationFiles');

  // Initialize help texts
  const helpTexts = {
    'documentation_link': {
      message: TAPi18n.__('editApi_hints_documentation_link'),
      options: {
        placement: 'left'
      }
    },
    'apiDocumentationEditor': {
      message: TAPi18n.__('editApi_hints_apiDocumentationEditor'),
      options: {
        placement: 'left'
      }
    },
    'importApiDocumentation': {
      message: TAPi18n.__('editApi_hints_importApiDocumentation'),
      options: {
        placement: 'left'
      }
    }
  };
  InlineHelp.initHelp(helpTexts);

  instance.autorun(function () {
    const apiBackend = ApiBackends.findOne(instance.data.apiBackend._id);
    // Save apibackend id
    Session.set('currentApiBackend', apiBackend);
  });
});

Template.manageApiDocumentationModal.onDestroyed(function() {
  // Unset session
  Session.set('currentApiBackend', undefined);
});

Template.manageApiDocumentationModal.events({
  'click .delete-documentation': function(event, instance) {

    // Get currentApiBackend documentationFileId
    const documentationFileId = this.apiBackend.documentationFileId;1

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    // Remove documentation object
    DocumentationFiles.remove(objectId);

    // Remove documenation file id field
    ApiBackends.update(instance.data.apiBackend._id, {$unset: { documentationFileId: "" }});

    sAlert.success(TAPi18n.__('manageApiDocumentationModal_DeletedFile_Message'));
  },
  'click #save-documentation-link': function(event, instance) {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  }
});


Template.manageApiDocumentationModal.helpers({
  documentationFile: function() {
    const currentApiBackend = Session.get('currentApiBackend');

    const currentDocumentationFileId = currentApiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      return currentDocumentationFile;
    }
  }
});
