/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Branding from '/packages/branding/collection';
import CoverPhoto from '/packages/branding/cover_photo/collection';

// APInf imports
import fileNameEndsWith from '/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  // Set cover photo id to branding collection on Success
  CoverPhoto.resumable.on('fileSuccess', (file) => {
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

  CoverPhoto.resumable.on('fileAdded', (file) => {
    return CoverPhoto.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
    }, (err) => {
      if (err) {
        // Create & show a message about failed
        const message = `${TAPi18n.__('uploadCoverPhoto_acceptedExtensions_errorText')} ${err}`;
        sAlert.warning(message);
        return;
      }

      // Available extensions for pictures
      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      // Check extensions for uploading file: is it a picture or not?
      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Upload the cover photo
        CoverPhoto.resumable.upload();
      } else {
        // Get extension error message
        const message = TAPi18n.__('uploadCoverPhoto_acceptedExtensions');

        // Alert user of extension error
        sAlert.error(message);
      }
    });
  });
});
