import { DocumentationFiles } from '/documentation/collection/collection';

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
        // Get the id from documentation file object
        const documentationFileId = file.uniqueIdentifier;

        // Get apibackend id
        const apiBackendId = Session.get('currentApiBackendId');

        // Update documenation file id field
        ApiBackends.update(apiBackendId, {$set: { documentationFileId }});

        // Hide modal
        Modal.hide('manageApiDocumentationModal');

        return DocumentationFiles.resumable.upload();
      });
    } else {
      // Inform user about file size Limit
      sAlert.warning(TAPi18n.__('manageApiDocumentationModal_SizeLimit_Message'));
    }
  });

});
