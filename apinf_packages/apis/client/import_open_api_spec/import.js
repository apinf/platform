/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collections imports
import Apis from '/apinf_packages/apis/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Template.importOpenApiSpecification.onCreated(function () {
  const instance = this;

  // Subscribe to particular DocumentationFile
  instance.autorun(() => {
    const fileId = Session.get('fileId');

    // Make sure a file is uploaded
    if (fileId) {
      instance.subscribe('singleDocumentationFile', fileId);
    }
  });

  // The selected option is file on default
  instance.selectFileType = new ReactiveVar(true);
  instance.submitForm = new ReactiveVar(false);
  // Stop spinner
  Session.set('fileUploading', false);

  instance.autorun(() => {
    // Get ID of uploaded file
    const fileId = Session.get('fileId');
    // Get status of form: submitted or not
    const submitForm = instance.submitForm.get();

    // File is uploaded and a user submit form
    if (fileId && submitForm) {
      // Start spinner
      Session.set('fileUploading', true);
      // Prepare query to insert ApiDocs collection
      const query = { fileId, type: 'file' };

      // get url of current site
      const siteUrl = Meteor.absoluteUrl().slice(0, -1);
      // Create URL to documentation
      const documentUrl = `${siteUrl}${DocumentationFiles.baseURL}/id/${fileId}`;

      // Add API by uploading OpenAPI specification file
      Meteor.call('importApiByDocument', documentUrl, instance.lifecycleStatus, query,
        (error, response) => {
          // Stop spinner
          Session.set('fileUploading', false);
          // If everything is ok
          if (response && response.isSuccessful) {
            instance.successCase(response);
          } else {
            // Get error message
            const message = error ? error.message : response.message;
            instance.errorCase(message, fileId);
          }
        });
    }
  });

  instance.removeDocumentationFile = (fileId) => {
    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(fileId);

    // Remove the document
    DocumentationFiles.remove(objectId);

    // Remove fileId
    Session.set('fileId', undefined);
  };

  instance.successCase = (response) => {
    // Redirect to new API
    FlowRouter.go('viewApi', { slug: response.slug });
    // Display message
    sAlert.success(response.message);
  };

  instance.errorCase = (message, fileId) => {
    // Display message
    sAlert.error(message);
    // Remove uploaded DocumentFile
    instance.removeDocumentationFile(fileId);
    // Form isn't submitted because of error
    instance.submitForm.set(false);
  };
});

Template.importOpenApiSpecification.onDestroyed(() => {
  // Unset sessions
  Session.set('fileId', undefined);
  Session.set('fileUploading', undefined);
});

Template.importOpenApiSpecification.helpers({
  optionFile () {
    return Template.instance().selectFileType.get();
  },
  fileUploding () {
    // Return spinner status
    return Session.get('fileUploading');
  },
  documentationFile () {
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
  lifecycleStatus () {
    // Get allowed lifecycle status values from collection schema
    const allowedStatuses = Apis.schema._schema.lifecycleStatus.allowedValues;

    return allowedStatuses.map(status => {
      // Put value and translated text for label
      return {
        value: status,
        option: TAPi18n.__(`schemas.apis.lifecycleStatus.options.${status}`) };
    });
  },
});

Template.importOpenApiSpecification.events({
  'change #select-type': (event, templateInstance) => {
    event.preventDefault();

    const fileType = templateInstance.selectFileType.get();

    // Revert value
    templateInstance.selectFileType.set(!fileType);
    // Form isn't submitted because of changing type
    templateInstance.submitForm.set(false);
  },
  'click #delete-document': (event, templateInstance) => {
    // Get ID of uploaded file
    const fileId = Session.get('fileId');

    // Remove DocumentFile
    templateInstance.removeDocumentationFile(fileId);
  },
  'submit #import-specification-form': (event, templateInstance) => {
    event.preventDefault();

    // Set the form is submitted
    templateInstance.submitForm.set(true);

    // Get value of URL field
    const url = event.target.elements['document-url'];
    // Get value of lifecycle status
    templateInstance.lifecycleStatus = event.target.elements['lifecycle-status'].value;
    // Get fileId of uploaded file
    const fileId = Session.get('fileId');

    // A user select "URL" option and inputs URL value
    if (url && url.value) {
      // Check file extension
      const acceptedExtensions = ['json', 'yml', 'yaml'];

      // Make sure the file extension
      if (fileNameEndsWith(url.value, acceptedExtensions)) {
        // Prepare query to insert ApiDocs collection
        const query = { type: 'url', remoteFileUrl: url.value };

        // Start spinner
        Session.set('fileUploading', true);

        Meteor.call('importApiByDocument', url.value, templateInstance.lifecycleStatus, query,
          (error, response) => {
            // Stop spinner
            Session.set('fileUploading', false);
            // If everything is ok
            if (response && response.isSuccessful) {
              templateInstance.successCase(response);
            } else {
              // Get error message
              const message = error ? error.message : response.message;
              templateInstance.errorCase(message, fileId);
            }
          });
      } else {
        // Form isn't submitted because of error
        templateInstance.submitForm.set(false);
        // Get translated text
        const message = TAPi18n.__('importApiFile_invalidExtension_message');
        // Alert error Message
        sAlert.error(message);        
      }
    }

    // A user doesn't upload file and doesn't fill URL field
    if (!fileId && !url) {
      // Form isn't submitted because of error
      templateInstance.submitForm.set(false);
      // Get translated text
      const message = TAPi18n.__('importOpenApiSpecification_message_provideSpecification');
      // Otherwise all fields are empty
      sAlert.error(message);
    }
  },
});
