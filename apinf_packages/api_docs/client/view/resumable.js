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
import ApiDocs from '/apinf_packages/api_docs/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';
import uploadingSpinner from '../manage/manage';

Meteor.startup(() => {
  // Set documentation id to api collection on Success
  DocumentationFiles.resumable.on('fileSuccess', (file) => {
    // Turn off spinner
    uploadingSpinner.set(false);

    // Get the id from documentation file object
    const fileId = file.uniqueIdentifier;

    // Get api id
    const api = Session.get('api');

    // Get ApiDoc object
    let apiDoc;
    // Check apiDocId
    if (Session.get('apiDocId')) {
      apiDoc = ApiDocs.findOne(Session.get('apiDocId'));
    } else {
      apiDoc = ApiDocs.findOne({ apiId: api._id });
    }

    // Check if ApiDoc is available
    // if so - update it with new values
    // if not - insert them
    if (apiDoc) {
      ApiDocs.update(apiDoc._id, { $set: { fileId, type: 'file' } });
    } else {
      ApiDocs.insert({ apiId: api._id, fileId, type: 'file' });
    }

    // Get success message translation
    const message = TAPi18n.__('manageApiDocumentationModal_AddedFile_Message');

    // Alert user of success
    sAlert.success(message);
  });

  DocumentationFiles.resumable.on('fileAdded', (file) => {
    if (file && file.size <= 10485760) { // Limit file size to 10 MB
      DocumentationFiles.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type,
      }, (error) => {
        if (error) {
          // Handle error condition
          throw new Meteor.Error('File creation failed!', error);
        }

        const acceptedExtensions = ['yaml', 'yml', 'txt', 'json'];

        if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
          // Turn on spinner
          uploadingSpinner.set(true);

          // Upload documentation
          DocumentationFiles.resumable.upload();
        } else {
          // Get error message translation
          const message = TAPi18n.__('manageApiDocumentationModal_FileType_Message');

          // Alert user of error
          sAlert.error(message);
        }
      });
    } else {
      // Get file size limit message translation
      const message = TAPi18n.__('manageApiDocumentationModal_SizeLimit_Message');

      // Alert user of file size warning
      sAlert.warning(message);
    }
  });
});
