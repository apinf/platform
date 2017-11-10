/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

// Npm packages imports
import SwaggerParser from 'swagger-parser';

Template.addApiBySwagger.onCreated(function () {
  this.selectOption = new ReactiveVar(true);
  this.apiParseData = new ReactiveVar(false);
  this.uploadingSpinner = new ReactiveVar(false);
  this.docId = new ReactiveVar(false);
  this.autorun(() => {
    if (this.docId.get()) {
      Meteor.subscribe('apisDocumentById', this.docId.get());
    }
  });
});

Template.addApiBySwagger.onRendered(function () {
  // Check api doc id is not available
  if (this.docId.get()) {
    // Set api doc id if it is available
    Session.set('apiDocId', this.docId.get());
  } else {
    Meteor.call('insertApiDoc', (err, res) => {
      if (res) {
        this.docId.set(res);
        // Set api doc id
        Session.set('apiDocId', res);
      }
    });
  }
});

Template.addApiBySwagger.onDestroyed(function () {
  if (this.docId.get()) {
    const docId = this.docId.get();
    // Check api doc has api id or not
    Meteor.call('checkApiIdInDoc', docId, (err, res) => {
      if (!res) {
        // If api doc does not have api id then remove api doc
        Meteor.call('removeApiDocById', docId);
      }
    });
  }
  this.apiParseData.set(false);
  this.docId.set(false);
  $('#url , #file').val('');
});

Template.addApiBySwagger.helpers({
  documentationFile () {
    const apiDoc = $('#apiDocId').val();

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
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
  optionFile () {
    return Template.instance().selectOption.get();
  },
  apiData () {
    const api = {};
    const parseData = Template.instance().apiParseData.get();
    if (parseData) {
      api.name = parseData.info.title;
      api.desc = parseData.info.description;
      api.url = `${parseData.schemes[0]}://${parseData.host}/${parseData.basePath}`;
    } else {
      api.name = '';
      api.desc = '';
      api.url = '';
    }
    return api;
  },
  spinnerEnabled () {
    // Return spinner status
    return Template.instance().uploadingSpinner.get();
  },
  docId () {
    return Template.instance().docId.get() || '';
  },
  shouldBeDisabled () {
    // if (Template.instance().apiParseData.get()) {
    //   return true;
    // }
    return false;
  },
});

Template.addApiBySwagger.events({
  'click #delete-documentation': function (event, templateInstance) {
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
  'change #selectOption': function (event) {
    event.preventDefault();
    if ($('#selectOption').val() === 'file') {
      Template.instance().selectOption.set(true);
    } else {
      Template.instance().selectOption.set(false);
    }
  },
  'change #file': function (event) {
    event.preventDefault();
    // Set template instance
    const templateInstance = Template.instance();

    // Defince variable as FileReader
    const file = $('#file')[0].files[0];
    const reader = new FileReader();
    if ($('#file').val()) {
      templateInstance.uploadingSpinner.set(true);
      reader.onload = function () {
        try {
          // Parse data from yaml or json file
          const parseData = SwaggerParser.YAML.parse(reader.result);
          // Validate data
          Meteor.call('checkData', parseData, (err,res) => {
            if (err || !res) {
              sAlert.error(err);
            } else if (res.status === 'error') {
              sAlert.error(res.message);
            } else {
              // Set data in reactive variable
              /* const docId = DocumentationFiles.insert({
                  _id: new Meteor.Collection.ObjectID(),  // This is the ID resumable will use
                  filename: file.name,
                  contentType: 'application/x-yaml',
                },
                function (err, _id) {  // Callback to .insert
                  if (err) { return console.error("File creation failed!", err); }
                  const apiDocData = {
                    "type": "file",
                    "fileId": _id._str,
                  }
                  Meteor.call('insertApiDoc', apiDocData, (err, res) => {
                    if(!err && res) {
                      templateInstance.docId.set(res);
                    }
                  });
                  templateInstance.docId.set(_id._str);
                  // Once the file exists on the server, start uploading
                  DocumentationFiles.resumable.upload();
              });
               DocumentationFiles.resumable.on('fileAdded', function (file) {

              // Create a new file in the file collection to upload
                DocumentationFiles.insert({
                  _id: new Meteor.Collection.ObjectID(),  // This is the ID resumable will use
                  filename: file.name,
                  contentType: 'application/x-yaml'
                  },
                  function (err, _id) {  // Callback to .insert
                    if (err) { return console.error("File creation failed!", err); }
                    // Once the file exists on the server, start uploading
                    DocumentationFiles.resumable.upload();
                  }
                );
              }); */

              templateInstance.apiParseData.set(parseData);
              templateInstance.uploadingSpinner.set(false);
              $('#submitApiBySwagger-button').removeAttr('disabled', 'disabled');
              $('#modal-upload-swagger').modal('hide').css('display', 'none');
            }
          });
        } catch (e) {
          sAlert.error('File is not in correct format');
        }
      };
      // Read file as binary String
      reader.readAsBinaryString(file);
    } else {
      $('#submitApiBySwagger-button').attr('disabled', 'disabled');
    }
  },
  'change #url': function (event) {
    event.preventDefault();
    const templateInstance = Template.instance();
    const parseData = {
      url: $('#url').val(),
      docId: templateInstance.docId.get(),
    };

    if ($('#url').val()) {
      templateInstance.uploadingSpinner.set(true);
      Meteor.call('parseDataByUrl', parseData, (err, res) => {
        if (err || !res) {
          sAlert.error(err);
        } else {
          if (res.status === 'error') {
            sAlert.error(res.data);
          } else {
            templateInstance.apiParseData.set(res.data);
            templateInstance.docId.set(res.docId);
            $('#modal-upload-swagger').modal('hide').css('display', 'none');
          }
          $('#submitApiBySwagger-button').removeAttr('disabled', 'disabled');
          templateInstance.uploadingSpinner.set(false);
        }
      });
    } else {
      $('#submitApiBySwagger-button').attr('disabled', 'disabled');
    }
  },
  'click .btn-reset': function (event) {
    event.preventDefault();
    const templateInstance = Template.instance();
    Meteor.call('removeApiDocById', templateInstance.docId.get());
    templateInstance.apiParseData.set(false);
    templateInstance.docId.set(false);
    $('#url, #file').val('');
  },
});
