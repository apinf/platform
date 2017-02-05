import { DocumentationFiles } from '/documentation/collection/collection';
import Apis from '/apis/collection';
import { fileNameEndsWith } from '/core/helper_functions/file_name_ends_with';
import uploadingSpinner from '../manage/manage';

Meteor.startup(() => {
  // Set documentation id to api collection on Success
  DocumentationFiles.resumable.on('fileSuccess', (file) => {
    // Turn off spinner
    uploadingSpinner.set(false);

    // Get the id from documentation file object
    const documentationFileId = file.uniqueIdentifier;

    // Get api id
    const api = Session.get('api');

    // Update documenation file id field
    Apis.update(api._id, { $set: { documentationFileId } });

    // Get success message translation
    const message = TAPi18n.__('manageApiDocumentationModal_AddedFile_Message');

    // Alert user of success
    sAlert.success(message);
  });

  DocumentationFiles.resumable.on('fileAdded', (file) => {
    if (file && file.size <= 10485760) { // Limit file size to 10 MB
      return DocumentationFiles.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type,
      }, (err, documentationFile) => {
        if (err) {
          console.warn('File creation failed!', err);
          return;
        }

        const acceptedExtensions = ['yaml', 'yml', 'txt', 'json'];

        if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
          // Turn on spinner
          uploadingSpinner.set(true);
          // Upload documentation
          return DocumentationFiles.resumable.upload();
        }
          // Get error message translation
        const message = TAPi18n.__('manageApiDocumentationModal_FileType_Message');

          // Alert user of error
        sAlert.error(message);
      });
    }
      // Inform user about file size Limit

      // Get file size limit message translation
    const message = TAPi18n.__('manageApiDocumentationModal_SizeLimit_Message');

      // Alert user of file size warning
    sAlert.warning(message);
  });
});
