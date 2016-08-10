import { ApiLogo } from '/apis/logo/collection/collection';
import { ApiBackends } from '/apis/collection/backend';
import { fileNameEndsWith } from '/lib/helperFunctions/fileNameEndsWith';

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

      const acceptedExtensions = ["jpg", "jpeg", "png", "gif"];

      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {

        // Get the id from API logo file object
        const apiLogoFileId = file.uniqueIdentifier;

        // Get apibackend id
        const apiBackend = ApiBackends.findOne();

        // Update logo id field
        ApiBackends.update(apiBackend._id, {$set: { apiLogoFileId }});

        sAlert.success(TAPi18n.__('apiLogo_resumable_successfully_uploaded'));

        return ApiLogo.resumable.upload();
      } else {

        sAlert.error(TAPi18n.__('apiLogo_resumable_acceptedExtensions'));
      }

    });
  });
});
