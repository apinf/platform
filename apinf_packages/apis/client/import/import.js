/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import jsyaml from 'js-yaml';

Template.importApiConfiguration.events({

  'change #import-api': (event) => {
    // File in input
    const file = event.target.files[0];

    // Check file extension
    const acceptedExtensions = ['json', 'yml', 'yaml', 'txt'];
    const fileNameArray = file.name.split('.');
    if (acceptedExtensions.indexOf(fileNameArray[fileNameArray.length - 1]) === -1) {
      // Get error message translation
      const message = TAPi18n.__('importApiConfiguration_errorMessage');

      // notifies user if file extension is not as expected
      sAlert.error(message);

      // Hide preview
      $('.file-preview').animate({ opacity: 0 }, 400, () => {
        $('.file-preview pre').html(null);
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
      $('.file-preview pre').html(importedFile);
      $('.file-preview').animate({ opacity: 1 });
    };
  },
});
