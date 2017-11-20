/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

// Meteor contributed packages imports
import { FS } from 'meteor/cfs:filesystem';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
 

// APInf imports
import Apis from '/apinf_packages/apis/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

// Npm packages imports
import SwaggerParser from 'swagger-parser';
import _ from 'lodash';
import jsyaml from 'js-yaml';

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
  if (!this.docId.get()) {
    Meteor.call('insertApiDoc', (err, res) => {
      if (res) {
        this.docId.set(res);
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
      api.url = `${parseData.schemes[0]}://${parseData.host}${parseData.basePath}`;
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
    // const message = TAPi18n.__('manageApiDocumentationModal_DeletedFile_ConfirmationMessage');

    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    // const confirmation = confirm(message);

    // Check if user clicked "OK"
    // if (confirmation === true) {
    //   // Get ApiDic fileId
    //   const documentationFileId = this.apiDoc.fileId;

    //   // Convert to Mongo ObjectID
    //   const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    //   // Remove documentation object
    //   DocumentationFiles.remove(objectId);

    //   // Remove fileId
    //   ApiDocs.update(templateInstance.data.apiDoc._id, {
    //     $unset: { fileId: '' },
    //   });

    //   // Get deletion success message translation
    //   const successfulMessage = TAPi18n.__('manageApiDocumentationModal_DeletedFile_Message');

    //   // Alert user of successful deletion
    //   sAlert.success(successfulMessage);
    // }
  },
  'change #selectOption': function (event) {
    event.preventDefault();
    if ($('#selectOption').val() === 'file') {
      Template.instance().selectOption.set(true);
    } else {
      Template.instance().selectOption.set(false);
    }
  },
  'change #apiDocumentFile': function (event) {
    event.preventDefault();
    const templateInstance = Template.instance();
    const parseData = {
      file: event.target.files[0],
      docId: templateInstance.docId.get(),
    };
    console.log(':: file ',parseData.file)
    // Iterates through each file uploaded
    // const file = event.target.files[0];

    // Check file extension
    const acceptedExtensions = ['json', 'yml', 'yaml'];

    if (fileNameEndsWith(parseData.file.name, acceptedExtensions)) {
      // Initialize a new FileReader to reader the file
      const fileReader = new FileReader();

      // Read file
      fileReader.readAsText(parseData.file, 'UTF-8');

      // Callback when the file is loaded
      fileReader.onload = (onLoadEvent) => {
        let importedFile = onLoadEvent.target.result;
        let yamlToJson;

        // If file is not a JSON, convert it
        if (!parseData.file.name.endsWith('json')) {
          // converts YAML to JSON
          yamlToJson = jsyaml.load(importedFile);
          
          // parses JSON obj to JSON String with indentation
          importedFile = JSON.stringify(yamlToJson, null, '\t');
        }
        const apiData = yamlToJson || JSON.parse(importedFile);
        console.log(':: importedFile ',apiData)
        Meteor.call('checkData', apiData, (err, res) => {
          if (err || !res) {
            sAlert.error(err);
          } else {
            if (res.status === 'error') {
              sAlert.error(res.data);
            } else {
              templateInstance.apiParseData.set(apiData);
              DocumentationFiles.insert(parseData.file, (err, res) => {
                if (err || !res ) {
                  console.log(':: err ',err)
                } else {
                  console.log(':: res ',res._str)
                  const docData = {
                    apiDocId:   templateInstance.docId.get(),
                    docId : res._str,
                    filename: parseData.file.name,
                    contentType: parseData.file.type || "application/x-yaml",
                  };
                  Meteor.call('updateApiDoc', docData , (err, res) => {
                    if (err || !res) {
                      sAlert.error(err);
                    } else {
                      $('#submitApiBySwagger-button').removeAttr('disabled', 'disabled');
                    }
                  });
                }
              });
            }
          }
          templateInstance.uploadingSpinner.set(false);
        });
      };
    } else {
      // Get error message translation
      const message = TAPi18n.__('importApiConfiguration_errorMessage');

      // Notifies user if file extension is not as expected
      sAlert.error(message);

      // Hide preview and reset data template value
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
