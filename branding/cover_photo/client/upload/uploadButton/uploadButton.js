// Import meteor packages
import { Template } from 'meteor/templating';
// Import apinf collections
import CoverPhoto from '/branding/cover_photo/collection';

Template.uploadCoverPhotoButton.onRendered(function() {
  // Assign resumable browse to element
  CoverPhoto.resumable.assignBrowse($('#cover-photo-browse'));
});
