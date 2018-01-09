/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import ProjectLogo from '/apinf_packages/branding/logo/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  // Set cover photo id to branding collection on Success
  ProjectLogo.resumable.on('fileSuccess', (file) => {
    // Finish uploading
    Session.set('logoUploading', false);

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
  });

  ProjectLogo.resumable.on('fileAdded', (file) => {
    // Available extensions for pictures
    const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    // Make sure the file extension is allowed
    if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
      // Insert record about file to collection
      ProjectLogo.insert({
        _id: file.uniqueIdentifier,
        filename: file.fileName,
        contentType: file.file.type,
      }, (error) => {
        if (error) {
          // Handle error condition
          throw new Meteor.Error('File creation failed!', error);
        }

        // Start uploading
        Session.set('logoUploading', true);

        // Upload file
        ProjectLogo.resumable.upload();
      });
    } else {
      // Finish uploading
      Session.set('logoUploading', false);

      // Get extension error message
      const message = TAPi18n.__('uploadProjectLogo_acceptedExtensions');

      // Alert user of extension error
      sAlert.error(message);
    }
  });
});
