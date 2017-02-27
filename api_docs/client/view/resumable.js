import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import ApiDocs from '/api_docs/collection';
import fileNameEndsWith from '/core/helper_functions/file_name_ends_with';
import DocumentationFiles from '/doc_files/collection';
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

    // Update documentation file id field
    ApiDocs.update(api._id, { $set: {
      fileId,
      type: 'file',
    } });

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
      }, (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.warn('File creation failed!', err);
          return;
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
