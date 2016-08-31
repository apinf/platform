import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';
import { fileNameEndsWith } from '/lib/helperFunctions/fileNameEndsWith';

Meteor.startup( function() {
  ProjectLogo.resumable.on('fileAdded', function(file) {
    return ProjectLogo.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type
    }, function(err, projectLogoFile) {
      if (err) {
        console.warn("File creation failed!", err);
        return;
      }

      const acceptedExtensions = ["jpg", "jpeg", "png", "gif"];

      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {

        // Get the id from project logo file object
        const projectLogoFileId = file.uniqueIdentifier;

        // Get branding
        const branding = Branding.findOne();

        // Update logo id field
        Branding.update(branding._id, {$set: { projectLogoFileId }});

        sAlert.success(TAPi18n.__('uploadProjectLogo_resumable_successfully_uploaded'));

        return ProjectLogo.resumable.upload();
      } else {

        sAlert.error(TAPi18n.__('uploadProjectLogo_resumable_acceptedExtensions'));
      }

    });
  });
});
