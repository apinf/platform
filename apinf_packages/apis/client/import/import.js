/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import jsyaml from 'js-yaml';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Template.importApiConfiguration.onCreated(() => {
  // Create the apiConfiguration variable
  Template.instance().data.apiConfiguration = new ReactiveVar();
});

Template.importApiConfiguration.helpers({
  // Get apiConfiguration value
  apiConfiguration () {
    return Template.instance().data.apiConfiguration.get();
  },
});

Template.importApiConfiguration.events({
  'change #import-api': (event, templateInstance) => {
    // File in input
    const file = event.target.files[0];

    // Check file extension
    const acceptedExtensions = ['json', 'yml', 'yaml'];
    if (!fileNameEndsWith(file.name, acceptedExtensions)) {
      // Get error message translation
      const message = TAPi18n.__('importApiConfiguration_errorMessage');

      // notifies user if file extension is not as expected
      sAlert.error(message);

      // Hide preview and reset data template value
      $('.file-preview').animate({ opacity: 0 }, 400, () => {
        templateInstance.data.apiConfiguration.set(null);
      });

      return;
    }

    // Instanciate a new FileReader to reader the file
    const fileReader = new FileReader();

    // Read file
    fileReader.readAsText(file, 'UTF-8');

    // Callback when the file is loaded
    fileReader.onload = (onLoadEvent) => {
      let importedFile = onLoadEvent.target.result;

      // If file is not a JSON, convert it
      if (!file.name.endsWith('json')) {
        // converts YAML to JSON
        const yamlToJson = jsyaml.load(importedFile);

        // parses JSON obj to JSON String with indentation
        importedFile = JSON.stringify(yamlToJson, null, '\t');
      }

      // Output value in screen
      templateInstance.data.apiConfiguration.set(importedFile);
      $('.file-preview').animate({ opacity: 1 });
    };
  },

  'submit #apiConfigurationUploadForm': (event, templateInstance) => {
    // Prevents the form submit
    event.preventDefault();

    // try catch here, so that page does not reload if JSON is incorrect
    try {
      // parses JSON String to apiConfiguration
      const api = JSON.parse(templateInstance.data.apiConfiguration.get());

      // import apiConfiguration: expects status from callback
      Meteor.call('importApiConfigs', api, (err, status) => {
        // error handing
        if (err) sAlert.error(err.reason);

        // checks of status is successfull`
        if (status.isSuccessful) {
          // success message
          sAlert.success(status.message);

          // redirects to apiBackend view page
          FlowRouter.go(`/apis/${status.slug}`);
        } else {
          // error message
          sAlert.error(status.message); // apiConfiguration.set('aaa');
        }
      });
    } catch (e) {
      // Get translated error message
      const message = TAPi18n.__('importApiConfiguration_jsonError_message');

      // Alert user of error
      sAlert.error(message);
    }
  },
});
