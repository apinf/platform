// Import meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
// Import apinf collections
import Branding from '/branding/collection';
import CoverPhoto from '/branding/cover_photo/collection';

Template.viewCoverPhoto.onCreated(function () {
  const instance = this;
  // Subscribe to Branding collection
  instance.subscribe('branding');
  // Subscribe to Cover Photo collection
  instance.subscribe('coverPhoto');
});

Template.viewCoverPhoto.helpers({
  coverPhotoExists () {
    // Get Branding collection
    const branding = Branding.findOne();

    // Check Branding collection and cover photo exist
    return branding && branding.coverPhotoFileId;
  },
  uploadedCoverPhotoLink () {
    const currentCoverPhotoFileId = Branding.findOne().coverPhotoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentCoverPhotoFileId);

    // Get cover photo file Object
    const currentCoverPhotoFile = CoverPhoto.findOne(objectId);

    // Check if cover photo file is available
    if (currentCoverPhotoFile) {
      // Get cover photo file URL
      return Meteor.absoluteUrl().slice(0, -1) + CoverPhoto.baseURL + '/md5/' + currentCoverPhotoFile.md5;
    }
    return '';
  },
});
