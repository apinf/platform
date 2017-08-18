/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import ApiDocs from '/apinf_packages/api_docs/collection';
import Settings from '/apinf_packages/settings/collection';

Template.apiDocumentation.onCreated(function () {
  const instance = this;

  // On default don't display editor
  instance.displayEditor = new ReactiveVar(false);
  instance.documentationExists = new ReactiveVar();

  // Run subscription in autorun
  instance.autorun(() => {
    // Get current documentation file Id
    const apiDoc = Template.currentData().apiDoc;

    // If apiDoc is undefined then swagger document doesn't exist
    // If apiDoc exists then swagger document either as file or as url to remote file
    const docAvailable = apiDoc && !!(apiDoc.fileId || apiDoc.remoteFileUrl);

    instance.documentationExists.set(docAvailable);

    // Check if it is available
    if (apiDoc) {
      const documentationFileId = apiDoc.fileId;

      // Check if it is available
      if (documentationFileId) {
        // Subscribe to documentation
        instance.subscribe('singleDocumentationFile', documentationFileId);
      }
    }
  });

  // Subscribe to code generator settings
  instance.subscribe('singleSetting', 'sdkCodeGenerator');
});

Template.apiDocumentation.onRendered(() => {
  $('[data-toggle="popover"]').popover();
});

Template.apiDocumentation.helpers({
  documentationExists () {
    return Template.instance().documentationExists.get();
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
  displayEditor () {
    return Template.instance().displayEditor.get();
  },
  displayLinkBlock () {
    const api = this.api;
    const apiDoc = this.apiDoc;

    // Display block if a user is manager of current API or URL is set
    return api.currentUserCanManage() || apiDoc.otherUrl;
  },
  displayViewBlock () {
    const api = this.api;
    const instance = Template.instance();

    // Display block if a user is manager of current API or swagger documentation is available
    return api.currentUserCanManage() || instance.documentationExists.get();
  },
});

Template.apiDocumentation.events({
  'click #manage-api-documentation': function (event, templateInstance) {
    // Get reference to API
    const api = templateInstance.data.api;

    // Get API ID
    const apiId = api._id;

    // Find related documentation object
    const apiDoc = ApiDocs.findOne({ apiId });

    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { api, apiDoc });
  },
  'click #sdk-code-generator': function (event, templateInstance) {
    // Get reference to API backend
    const api = templateInstance.data.api;
    // Get reference to Code Generator host
    const host = templateInstance.codegenServer;
    // Show the SDK Code generator form
    Modal.show('sdkCodeGeneratorModal', { api, host });
  },
  'click .editor': () => {
    const editor = Template.instance().displayEditor;

    // Get value of current flag (true or false)
    const displayEditor = editor.get();
    // Toggle this value
    editor.set(!displayEditor);
  },
});
