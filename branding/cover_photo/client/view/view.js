/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Collection imports
import CoverPhoto from '/branding/cover_photo/collection';

Template.viewCoverPhoto.onCreated(function () {
  const instance = this;

  // Subscribe to Cover Photo collection
  instance.subscribe('coverPhoto');
});

Template.viewCoverPhoto.helpers({
  coverPhotoExists () {
    const branding = Template.currentData().branding;

    // Check Branding collection and cover photo exist
    return branding && branding.coverPhotoFileId;
  },
  uploadedCoverPhotoLink () {
    const currentCoverPhotoFileId = Template.currentData().branding.coverPhotoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentCoverPhotoFileId);

    // Get cover photo file Object
    const currentCoverPhotoFile = CoverPhoto.findOne(objectId);

    let coverPhotoFileUrl;
    // Check if cover photo file is available
    if (currentCoverPhotoFile) {
      // Get Meteor absolute URL
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

      const baseCoverFotoURL = meteorAbsoluteUrl + CoverPhoto.baseURL;

      // Get cover photo file URL
      coverPhotoFileUrl = `${baseCoverFotoURL}/md5/${currentCoverPhotoFile.md5}`;
    }
    return coverPhotoFileUrl;
  },
});
