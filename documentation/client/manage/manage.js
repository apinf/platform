import { DocumentationFiles } from '/documentation/collection/collection';
import { Apis } from '/apis/collection';
import { Settings } from '/settings/collection';

Template.manageApiDocumentationModal.onCreated(function () {
  const instance = this;

  instance.autorun(function () {
    const api = Apis.findOne(instance.data.api._id);
    // Save apibackend id
    Session.set('api', api);
  });

  // Subscribe to documentation editor settings
  instance.subscribe('singleSetting', 'apiDocumentationEditor');
});

Template.manageApiDocumentationModal.onDestroyed(function () {
  // Unset session
  Session.set('api', undefined);
});

Template.manageApiDocumentationModal.events({
  'click .delete-documentation': function (event, instance) {
    // Get confirmation message translation
    const message = TAPi18n.__('manageApiDocumentationModal_DeletedFile_ConfirmationMessage');

    // Show confirmation dialog to user
    const confirmation = confirm(message);

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get currentApiBackend documentationFileId
      const documentationFileId = this.api.documentationFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(documentationFileId);

      // Remove documentation object
      DocumentationFiles.remove(objectId);

      // Remove documenation file id field
      Apis.update(instance.data.api._id, { $unset: { documentationFileId: '' } });

      // Get deletion success message translation
      const message = TAPi18n.__('manageApiDocumentationModal_DeletedFile_Message');

      // Alert user of successful deletion
      sAlert.success(message);
    }
  },
  'click #save-documentation-link': function (event, instance) {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
  'click #open-api-editor': function (event, instance) {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
});


Template.manageApiDocumentationModal.helpers({
  documentationFile () {
    const api = Session.get('api');

    const documentationFileId = api.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    // Get documentation file Object
    const documentationFile = DocumentationFiles.findOne(objectId);

    // Check if documentation file is available
    if (documentationFile) {
      return documentationFile;
    }
  },
  apiDocumentationEditorIsEnabled () {
    // Get settings
    const settings = Settings.findOne();

    // Check settings exists, editor is enabled and host setting exists
    if (
      settings &&
      settings.apiDocumentationEditor &&
      settings.apiDocumentationEditor.enabled &&
      settings.apiDocumentationEditor.host) {
      // Editor is enabled and has host setting, return true
      return true;
    } else {
      // Otherwise return false
      return false;
    }
  },
  apisCollection () {
    // Return a reference to Apis collection, for AutoForm
    return Apis;
  },
  // Return list of all try-out methods, which is used in Swagger Options
  supportedSubmitMethods () {
    return [
      {label: 'GET', value: 'get'},
      {label: 'POST', value: 'post'},
      {label: 'DELETE', value: 'delete'},
      {label: 'PATCH', value: 'patch'},
      {label: 'PUT', value: 'put'}
    ]
  },
});
