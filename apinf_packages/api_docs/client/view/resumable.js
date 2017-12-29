/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  // Set documentation id to api collection on Success
  DocumentationFiles.resumable.on('fileSuccess', (file) => {
    // Uploading finished
    Session.set('fileUploading', false);
    // Save value of file ID
    Session.set('fileId', file.uniqueIdentifier);
  });

  DocumentationFiles.resumable.on('fileAdded', (file) => {
    // Limit file size to 10MB
    if (file && file.size <= 10485760) {
      const acceptedExtensions = ['yaml', 'yml', 'json'];

      // Make sure the file extension is allowed
      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Upload file to collection
        DocumentationFiles.insert({
          _id: file.uniqueIdentifier,
          filename: file.fileName,
          contentType: file.file.type,
        }, (error) => {
          if (error) {
            // Handle error condition
            throw new Meteor.Error('File creation failed!', error);
          }

          // Uploading start
          Session.set('fileUploading', true);

          // Upload documentation
          DocumentationFiles.resumable.upload();
        });
      } else {
        // Get error message translation
        const message = TAPi18n.__('manageApiDocumentationModal_FileType_Message');

        // Alert user of error
        sAlert.error(message);
      }
    } else {
      // Finish uploading
      Session.set('fileUploading', false);

      // Get file size limit message translation
      const message = TAPi18n.__('manageApiDocumentationModal_SizeLimit_Message');

      // Alert user of file size warning
      sAlert.warning(message);
    }
  });
});
