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

  // Save apibackend id
  Session.set('currentApiBackendId', instance.data.apiBackend._id);
});

Template.manageApiDocumentationModal.onDestroyed(function() {
  // Unset session
  Session.set('currentApiBackendId', undefined);
})

Template.manageApiDocumentationModal.onRendered(function() {
  // Assign resumable browse to element
  DocumentationFiles.resumable.assignBrowse($('.fileBrowse'));
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

    // Hide modal
    Modal.hide('manageApiDocumentationModal');

    sAlert.success(TAPi18n.__('manageApiDocumentationModal_DeletedFile_Message'));
  },
  'click #save-documentation-link': function(event, instance) {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  }
});


Template.manageApiDocumentationModal.helpers({
  fileName: function() {
    const currentDocumentationFileId = this.apiBackend.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentDocumentationFileId);

    // Get documentation file Object
    const currentDocumentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (currentDocumentationFile) {
      return currentDocumentationFile.filename;
    }
  },
  documentationExists: function () {
    const currentApiBackend = this.apiBackend;
    if (currentApiBackend.documentationFileId) {
      return true;
    }
  }
});
