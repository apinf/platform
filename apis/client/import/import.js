/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FS } from 'meteor/cfs:filesystem';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { ace } from 'meteor/mizzao:sharejs-ace';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import jsyaml from 'js-yaml';

Template.importApiConfiguration.onRendered(function () {
  // keep current template instance
  const instance = this;

  // initialises ace editor
  instance.editor = ace.edit('editor');

  // theme for editor
  instance.editor.setTheme('ace/theme/idle_fingers');

  // code highlights for editor (JSON)
  instance.editor.getSession().setMode('ace/mode/json');

  // custom message (tutorial) in json format
  const tips = {
    HowToImportConfigurations: {
      option_1: 'Upload existing config file.',
      option_2: 'Paste configurations here.',
      'available_file_extensions:': 'JSON, YAML or TXT.',
    },
  };

  // parses json object to string with indentation (parsing to string needed for ace editor)
  const jsonString = JSON.stringify(tips, null, '\t');

  // pastes initial value to editor
  instance.editor.setValue(jsonString);
});

// Get reference to template instance
Template.importApiConfiguration.onCreated(function () {
  const instance = this;

  // function attached to template instance checks file extension
  instance.checkFileExtension = function (filename, suffixList) {
    // iterate through extensions passed into suffixList array
    for (let i = 0; i < suffixList.length; i++) {
      // parses line to check if filename contains current suffix
      const containsCurrentSuffix = filename.indexOf(
        suffixList[i], filename.length - suffixList[i].length
      ) !== -1;

      // if current extension found in filename then change the state variable
      if (containsCurrentSuffix) return true;
    }

    return false;
  };
});

Template.importApiConfiguration.events({
  'dropped #dropzone': function (event, templateInstance) {
    // grabs "dropped" files and iterates through them
    FS.Utility.eachFile(event, (file) => {
      // checks if file is found
      if (file) {
        // initialises new reader templateInstance
        const reader = new FileReader();

        // reads file - expecting YAML, JSON or TXT
        reader.readAsText(file, 'UTF-8');

        // once file is loaded, doing smth with it
        reader.onload = function (onLoadEvent) {
          // gets file contents
          const importedFile = onLoadEvent.target.result;

          let apiConfiguration = {};

          const acceptedExtensions = ['yaml', 'yml', 'txt', 'json'];

          // checks if file name contains one of accepted extensions
          if (templateInstance.endsWith(file.name, acceptedExtensions)) {
            // checks if file extension is .YAML or .TXT
            if (templateInstance.endsWith(file.name, ['yaml', 'yml', 'txt'])) {
              // converts YAML to JSON
              const yamlToJson = jsyaml.load(importedFile);

              // parses JSON obj to JSON String with indentation
              apiConfiguration = JSON.stringify(yamlToJson, null, '\t');
            }

            // checks if file extension is .JSON
            if (templateInstance.endsWith(file.name, ['json'])) {
              // if JSON - no need to convert anything
              apiConfiguration = importedFile;
            }
          } else {
            // Get error message translation
            const message = TAPi18n.__('importApiConfiguration_errorMessage');

            // notifies user if file extension is not as expected
            sAlert.error(message);
          }

          // pastes converted file to ace editor
          templateInstance.editor.setValue(apiConfiguration);
        };
      }
    });

    return false;
  },
  'submit #apiConfigurationUploadForm': function (event, templateInstance) {
    // gets current data from ace editor
    const jsonString = templateInstance.editor.getValue();

    // try catch here, so that page does not reload if JSON is incorrect
    try {
      // parses JSON String to apiConfiguration
      const apiConfiguration = JSON.parse(jsonString);

      // import apiConfiguration: expects status from callback
      Meteor.call('importApiConfigs', apiConfiguration, (err, status) => {
        // error handing
        if (err) sAlert.error(err);

        // checks of status is successfull`
        if (status.isSuccessful) {
          // success message
          sAlert.success(status.message);

          // redirects to apiBackend view page
          FlowRouter.go(`/api/${status.newBackendId}`);
        } else {
          // error message
          sAlert.error(status.message);
        }
      });
    } catch (e) {
      // Get translated error message
      const message = TAPi18n.__('importApiConfiguration_jsonError_message');

      // Alert user of error
      sAlert.error(message);
    }

    return false;
  },
});
