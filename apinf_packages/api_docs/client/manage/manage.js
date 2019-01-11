/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import ApiDocs from '/apinf_packages/api_docs/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

Template.manageApiDocumentationModal.onCreated(function () {
  const instance = this;

  // Turn off spinner if it was on
  Session.set('fileUploading', false);

  instance.removeDocumentationFile = (fileId) => {
    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(fileId);

    // Remove documentation object
    DocumentationFiles.remove(objectId);

    // Remove value from Session variable
    Session.set('fileId', undefined);
  };
});

Template.manageApiDocumentationModal.onDestroyed(() => {
  // Unset sessions
  Session.set('fileUploading', undefined);
});

Template.manageApiDocumentationModal.onRendered(function () {
  // Fetch other Url
  const apiDocs = ApiDocs.findOne();
  const links = _.get(apiDocs, 'otherUrl', []);
  Session.set('links', links);

  this.autorun(() => {
    const getLinks = Session.get('links');
    if (getLinks) {
      if (getLinks.length >= 8) {
        const message = TAPi18n.__('manageApiDocumentationModal_ToolTip_Message');
        $('#link-value').attr('disabled', true);
        $('#add-link').attr('disabled', true);
        $('#link-value').attr('title', message);
      } else {
        // If Session data is less than 8
        $('#link-value').attr('disabled', false);
        $('#add-link').attr('disabled', false);
        $('#link-value').attr('title', '');
      }
    }
  });
});

Template.manageApiDocumentationModal.helpers({
  documentationFile () {
    // Get fileId value
    const fileId = Session.get('fileId');

    if (fileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(fileId);

      // Get documentation file Object
      return DocumentationFiles.findOne(objectId);
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
  fileUploding () {
    // Return spinner status
    return Session.get('fileUploading');
  },
  otherUrls () {
    // Return Session
    return Session.get('links');
  },
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
      // Get fileId value
      const documentationFileId = Session.get('fileId');

      // Remove file from DocumentationFile collection
      templateInstance.removeDocumentationFile(documentationFileId);

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
    AutoForm.resetForm('apiDocumentationForm')
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
  'click #open-api-editor': function () {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
  'click #cancel-button': function (event, templateInstance) {
    const apiDocs = ApiDocs.findOne();

    // Make sure File isn't uploaded
    if (!apiDocs || !apiDocs.fileId) {
      // Get fileId value
      const fileId = Session.get('fileId');

      // If file is uploaded and a user clicks on "Cancel" button
      if (fileId) {
        // Remove uploaded file from collection
        templateInstance.removeDocumentationFile(fileId);
      }
    }
  },
  'click #add-link': function () {
    // Get Value from textbox
    const link = $('#link-value').val().trim();
    // Regex for https protocol
    const regex = SimpleSchema.RegEx.Url;
    const regexUrl = regex.test(link);
    // If value is https(s)
    if (regexUrl) {
      // make error message invisible
      $('#errorMessage').addClass('invisible');
      const linksData = Session.get('links');
      // If data is available in Session
      if (linksData) {
        linksData.push(link);
        Session.set('links', linksData);
      }
      // clear the text box
      $('#link-value').val('');
    } else {
      // Hide error message
      $('#errorMessage').removeClass('invisible');
    }
  },

  'click .delete-link': function (event) {
    // get links from session
    const otherUrlLinks = Session.get('links');
    // get cross id
    const deleteLinkId = event.currentTarget.id;
    if (otherUrlLinks) {
    // Remove elemtn from Session
      otherUrlLinks.splice(deleteLinkId, 1);
      Session.set('links', otherUrlLinks);
    }
  },
});
