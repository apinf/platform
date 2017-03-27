/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FS } from 'meteor/cfs:filesystem';
import { TAPi18n } from 'meteor/tap:i18n';
import { URI } from 'meteor/olragon:uri-js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import _ from 'lodash';
import jsyaml from 'js-yaml';

// Collection imports
import DocumentationFiles from '/api_docs/files/collection';

Template.importApiDocumentation.events({
  'change #apiDocumentationFile': function (event) {
    // Allowed file extensions for API documentation file
    const acceptedExtensions = ['yaml', 'yml', 'json'];

    // Iterates through each file uploaded
    FS.Utility.eachFile(event, (file) => {
      if (file) {
        // Get file's name & parse the file string to URI object
        const fileName = new URI(file.name);

        // Get the file extension
        const fileExtension = fileName.suffix().toLowerCase();

        // Check if the file suffix is in the allowed extensions list
        const extensionAllowed = _.contains(acceptedExtensions, fileExtension);

        // Read file if the extension is allowed
        if (extensionAllowed) {
          // Initialises new reader instance
          const reader = new FileReader();

          // Reads file
          reader.readAsText(file, 'UTF-8');

          reader.onload = function (renderEvent) {
            // Gets file contents
            const importedFile = renderEvent.target.result;

            // Checks for correct JSON or YAML syntax in file contents
            if (JSON.parse(importedFile) || jsyaml.safeLoad(importedFile)) {
              let doc = {};

              // Checks file's extension for its conversion to JSON object
              if (fileExtension === 'json') {
                // Convert JSON string to JSON object
                doc = JSON.parse(importedFile);
              } else if (_.contains(['yaml', 'yml'], fileExtension)) {
                // Convert YAML string/object to JSON object
                doc = jsyaml.load(importedFile);
              }

              // Insert file contents to a colletion
              DocumentationFiles.insert(doc);

              // TODO (restore this logic): Set session variable containing API Docs ID,
              // used for attaching apiBackendId to apiDocs document on success
            } else {
              // Get error message text
              const message = TAPi18n.__('importApiDocumentation_fileReadError_message');

              // Notifies user if not able to parse the file either as JSON or YAML objects.
              sAlert.error(message);
            }
          };
        } else {
          // Get error message text
          const message = TAPi18n.__('importApiDocumentation_fileExtensionError_message');

          // Notifies user if file extension provided is not supported
          sAlert.error(message);
        }
      }
    });
  },
});
