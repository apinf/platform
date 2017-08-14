/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import CoverPhoto from '/packages/branding/cover_photo/collection';

Template.uploadCoverPhotoButton.onRendered(() => {
  // Assign resumable browse to element
  CoverPhoto.resumable.assignBrowse($('#cover-photo-browse'));
});
