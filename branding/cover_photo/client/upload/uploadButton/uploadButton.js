// Import meteor packages
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

// Import apinf collections
import { Branding } from '/branding/collection';
import CoverPhoto from '/branding/cover_photo/collection';
import { fileNameEndsWith } from '/core/helper_functions/file_name_ends_with';


Template.uploadCoverPhotoButton.onRendered(function() {
  const instance = this;

  instance.uploadingSpinner = new ReactiveVar(false);

  // Assign resumable browse to element
  const test = CoverPhoto.resumable.assignBrowse($('#cover-photo-browse'));

  console.log(test);

  console.log(CoverPhoto.resumable);

  // Set cover photo id to branding collection on Success
  CoverPhoto.resumable.on('fileSuccess', function (file) {
    // Turn off spinner
    instance.uploadingSpinner.set(false);

    // Get the id from project logo file object
    const coverPhotoFileId = file.uniqueIdentifier;

    // Get branding
    const branding = Branding.findOne();

    // Update logo id field
    Branding.update(branding._id, { $set: { coverPhotoFileId } });

    // Get upload success message translation
    const message = TAPi18n.__('uploadCoverPhoto_successfully_uploaded');

    // Alert user of successful upload
    sAlert.success(message);
  });

  CoverPhoto.resumable.on('fileAdded', function (file) {
    return CoverPhoto.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
    }, function (err) {
      if (err) {
        console.warn('File creation failed!', err);
        return;
      }

      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Turn on spinner
        instance.uploadingSpinner.set(true);
        // Upload the cover photo
        return CoverPhoto.resumable.upload();
      }

      // Get extension error message
      const message = TAPi18n.__('uploadCoverPhoto_acceptedExtensions');

      // Alert user of extension error
      sAlert.error(message);
    });
  });
});
