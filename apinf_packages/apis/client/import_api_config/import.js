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
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Template.importApiConfiguration.onCreated(function () {
  // Initialize variable
  this.apiConfiguration = new ReactiveVar();
});

Template.importApiConfiguration.helpers({
  apiConfiguration () {
    const instance = Template.instance();

    // Get apiConfiguration value
    return instance.apiConfiguration.get();
  },
});

Template.importApiConfiguration.events({
  'change #import-api': (event, templateInstance) => {
    // File in input
    const file = event.target.files[0];

    // Check file extension
    const acceptedExtensions = ['json', 'yml', 'yaml'];

    if (file && fileNameEndsWith(file.name, acceptedExtensions)) {
      // Initialize a new FileReader to reader the file
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
        templateInstance.apiConfiguration.set(importedFile);
        $('.file-preview').animate({ opacity: 1 });
      };
    } else {
      // Get error message translation
      const message = TAPi18n.__('importApiConfiguration_errorMessage');

      // Notifies user if file extension is not as expected
      sAlert.error(message);

      // Hide preview and reset data template value
      $('.file-preview').animate({ opacity: 0 }, 400, () => {
        templateInstance.apiConfiguration.set(null);
      });
    }
  },
  'submit #apiConfigurationUploadForm': (event, templateInstance) => {
    // Prevents the form submit
    event.preventDefault();

    // try catch here, so that page does not reload if JSON is incorrect
    try {
      // parses JSON String to apiConfiguration
      const api = JSON.parse(templateInstance.apiConfiguration.get());
      const apiData = {};
      Object.keys(api).forEach((key) => {
        // Make all key in lowerCase
        apiData[key.toLowerCase()] = api[key];
      });
      // For valid Url
      const regex = SimpleSchema.RegEx.Url;
      // If json does't contain name and URL
      if (apiData && !apiData.name && !apiData.url) {
        const withoutNameUrl = TAPi18n.__('importApiConfiguration_file_without_name_and_url');
        sAlert.error(withoutNameUrl);
        return;
        // If json doesn't have name
      } else if (apiData && !apiData.name) {
        const isValidUrl = regex.test(api.url);
        // If Url is invalid and Name field doesn't exist
        if (!isValidUrl && !apiData.name) {
          const invalidUrlAndWithoutName = TAPi18n
          .__('importApiConfiguration_file_with_invalid_url_withoutName');
          sAlert.error(invalidUrlAndWithoutName);
        } else {
        // Only name exist
          const withOuthName = TAPi18n.__('importApiConfiguration_file_without_name');
          sAlert.error(withOuthName);
        }
        return;
        // if json does't have url
      } else if (apiData && !apiData.url) {
        const withOutUrl = TAPi18n.__('importApiConfiguration_file_without_url');
        sAlert.error(withOutUrl);
        return;
        // If Name and Url exist but invalid Url
      } else if (apiData && apiData.name && apiData.url) {
        const isValidUrl = regex.test(api.url);
        if (!isValidUrl) {
          const invalidMessage = TAPi18n.__('importApiConfiguration_file_with_invalid_url');
          sAlert.error(invalidMessage);
        }
        return;
      }
      // Create a new API and get status about action
      Meteor.call('importApiConfigs', api, (err, status) => {
        // Error handing
        if (err) sAlert.error(err.reason);
        // Make sure status is successful
        if (status) {
          if (status.isSuccessful) {
          // Show message
            sAlert.success(status.message);

            // Redirects to API profile page
            FlowRouter.go('viewApi', { slug: status.slug });
          } else {
            // Show message about error
            sAlert.error(status.message);
          }
        }
      });
      } catch (e) {
      // Get message text
      const message = TAPi18n.__('importApiConfiguration_jsonError_message');

      // Show message
      sAlert.error(message);
      }
  },
});
