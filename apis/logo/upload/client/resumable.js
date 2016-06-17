import { ApiLogo } from '/apis/logo/collection/collection';

Meteor.startup( function() {
  ApiLogo.resumable.on('fileAdded', function(file) {
    return ApiLogo.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type
    }, function(err, apiLogoFile) {
      if (err) {
        console.warn("File creation failed!", err);
        return;
      }

      // Get the id from API logo file object
      const apiLogoFileId = file.uniqueIdentifier;

      // Get apibackend id
      const apiBackend = Session.get('currentApiBackend');

      // Update logo id field
      ApiBackends.update(apiBackend._id, {$set: { apiLogoFileId }});

      sAlert.success('Logo successfully uploaded!');

      return ApiLogo.resumable.upload();

    });
  });
});
