import { DocumentationFiles } from '/documentation/collection/collection';
import { fileNameEndsWith } from '/lib/helperFunctions/fileNameEndsWith';

Meteor.startup( function() {
  DocumentationFiles.resumable.on('fileAdded', function(file) {
    if(file && file.size <= 10485760) { // Limit file size to 10 MB
      return DocumentationFiles.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type
      }, function(err, documentationFile) {
        if (err) {
          console.warn("File creation failed!", err);
          return;
        }

        const acceptedExtensions = ["yaml", "yml", "txt", "json"];

        if (fileNameEndsWith(file.file.name, acceptedExtensions)) {

          // Get the id from documentation file object
          const documentationFileId = file.uniqueIdentifier;

          // Get apibackend id
          const apiBackend = Session.get('currentApiBackend');

          // Update documenation file id field
          ApiBackends.update(apiBackend._id, {$set: { documentationFileId }});

          sAlert.success(TAPi18n.__('manageApiDocumentationModal_AddedFile_Message'));

          return DocumentationFiles.resumable.upload();

        } else {

          sAlert.error(TAPi18n.__('manageApiDocumentationModal_FileType_Message'));
        }
      });
    } else {
      // Inform user about file size Limit
      sAlert.warning(TAPi18n.__('manageApiDocumentationModal_SizeLimit_Message'));
    }
  });

});
