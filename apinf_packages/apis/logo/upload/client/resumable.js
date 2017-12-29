/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiLogo from '/apinf_packages/apis/logo/collection';

// APInf imports
import fileNameEndsWith from '/apinf_packages/core/helper_functions/file_name_ends_with';

Meteor.startup(() => {
  ApiLogo.resumable.on('fileSuccess', (file) => {
    // Finish uploading
    Session.set('apiLogoUploading', false);

    // Get the id from API logo file object
    const apiLogoFileId = file.uniqueIdentifier;

    // Get api slug from route
    const apiSlug = FlowRouter.getParam('slug');

    // Get API with slug
    const api = Apis.findOne({ slug: apiSlug });

    // Update logo id field
    Apis.update(api._id, { $set: { apiLogoFileId } });

    // Get success message translation
    const message = TAPi18n.__('apiLogo_resumable_successfully_uploaded');

    sAlert.success(message);
  });

  ApiLogo.resumable.on('fileAdded', (file) => {
    // Limit file size to 10MB
    if (file && file.size <= 10485760) {
      // Available extensions for pictures
      const acceptedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      // Make sure the file extension is allowed
      if (fileNameEndsWith(file.file.name, acceptedExtensions)) {
        // Insert record about file to collection
        ApiLogo.insert({
          _id: file.uniqueIdentifier,
          filename: file.fileName,
          contentType: file.file.type,
        }, (error) => {
          if (error) {
            // Handle error condition
            throw new Meteor.Error('File creation failed!', error);
          }

          // Start uploading
          Session.set('apiLogoUploading', true);

          // Upload API Logo
          ApiLogo.resumable.upload();
        });
      } else {
        // Get error message translation related to accepted extensions
        const message = TAPi18n.__('apiLogo_resumable_acceptedExtensions');

        // Alert user of error
        sAlert.error(message);
      }
    } else {
      // Finish uploading
      Session.set('apiLogoUploading', false);

      // Get file size error message
      const message = TAPi18n.__('apiLogo_resumable_message_fileMaxSize');

      // Alert user of max size error
      sAlert.error(message);
    }
  });
});
