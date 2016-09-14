import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';
import { fileNameEndsWith } from '/core/helper_functions/file_name_ends_with';

Meteor.startup(function () {
  ProjectLogo.resumable.on('fileAdded', function (file) {
    return ProjectLogo.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
    }, function (err, projectLogoFile) {
      if (err) {
        console.warn('File creation failed!', err);
        return;
      }

      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Get the id from project logo file object
        const projectLogoFileId = file.uniqueIdentifier;

        // Get branding
        const branding = Branding.findOne();

        // Update logo id field
        Branding.update(branding._id, { $set: { projectLogoFileId } });

        // Get upload success message translation
        const message = TAPi18n.__('uploadProjectLogo_successfully_uploaded');

        // Alert user of successful upload
        sAlert.success(message);

        return ProjectLogo.resumable.upload();
      } else {
        // Get extension error message
        const message = TAPi18n.__('uploadProjectLogo_acceptedExtensions');

        // Alert user of extension error
        sAlert.error(message);
      }
    });
  });
});
