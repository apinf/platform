/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import Settings from '/apinf_packages/settings/collection';

const uploadingSpinner = new ReactiveVar(false);

Template.manageApiDocumentationModal.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    const api = Apis.findOne(instance.data.api._id);

    // Get API id
    const apiId = api._id;

    // Get ApiDoc object
    const apiDoc = ApiDocs.findOne({ apiId });

    // Save API
    Session.set('api', api);

    // Save ApiDoc
    Session.set('apiDoc', apiDoc);
  });

  // Turn off spinner if it was on
  uploadingSpinner.set(false);

  // Subscribe to documentation editor settings
  instance.subscribe('singleSetting', 'apiDocumentationEditor');
});

Template.manageApiDocumentationModal.onDestroyed(() => {
  // Unset sessions
  Session.set('api', undefined);
  Session.set('apiDoc', undefined);
});

Template.manageApiDocumentationModal.events({
  'click .delete-documentation': function (event, templateInstance) {
    // Get confirmation message translation
    const message = TAPi18n.__('manageApiDocumentationModal_DeletedFile_ConfirmationMessage');

    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(message);

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get ApiDic fileId
      const documentationFileId = this.apiDoc.fileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(documentationFileId);

      // Remove documentation object
      DocumentationFiles.remove(objectId);

      // Remove fileId
      ApiDocs.update(templateInstance.data.apiDoc._id, {
        $unset: { fileId: '' },
      });

      // Get deletion success message translation
      const successfulMessage = TAPi18n.__('manageApiDocumentationModal_DeletedFile_Message');

      // Alert user of successful deletion
      sAlert.success(successfulMessage);
    }
  },
  'click #save-documentation-link': function () {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
  'click #open-api-editor': function () {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
});

Template.manageApiDocumentationModal.helpers({
  documentationFile () {
    const apiDoc = Session.get('apiDoc');

    if (apiDoc) {
      // const documentationFileId = api.documentationFileId;
      const documentationFileId = apiDoc.fileId;

      if (documentationFileId) {
        // Convert to Mongo ObjectID
        const objectId = new Mongo.Collection.ObjectID(documentationFileId);

        // Get documentation file Object
        const documentationFile = DocumentationFiles.findOne(objectId);

        // Check if documentation file is available
        return documentationFile;
      }
    }
    // Otherwise return false
    return false;
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
    }
    // Otherwise return false
    return false;
  },
  apiDocsCollection () {
    // Return a reference to ApiDocs collection, for AutoForm
    return ApiDocs;
  },
  formType () {
    const instance = Template.instance();
    if (instance.data.apiDoc) {
      return 'update';
    }
    return 'insert';
  },
  // Return list of all try-out methods, which is used in Swagger Options
  supportedSubmitMethods () {
    return [
      { label: 'GET', value: 'get' },
      { label: 'POST', value: 'post' },
      { label: 'DELETE', value: 'delete' },
      { label: 'PATCH', value: 'patch' },
      { label: 'PUT', value: 'put' },
    ];
  },
  spinnerEnabled () {
    // Return spinner status
    return uploadingSpinner.get();
  },
});

export default uploadingSpinner;
