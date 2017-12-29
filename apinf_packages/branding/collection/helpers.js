/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Collection imports
import CoverPhoto from '/apinf_packages/branding/cover_photo/collection';
import ProjectLogo from '/apinf_packages/branding/logo/collection';
import Branding from '../collection';

Branding.helpers({
  siteLogoUrl () {
    let url;

    // Check project logo exist
    if (this.projectLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(this.projectLogoFileId);

      // Get project logo file Object
      const logoFile = ProjectLogo.findOne(objectId);

      // Check if project logo file exists
      if (logoFile) {
        // Get site logo meteor base URL
        const logoMeteorBaseUrl = Meteor.absoluteUrl().slice(0, -1) + ProjectLogo.baseURL;

        // Get full URL to file
        url = `${logoMeteorBaseUrl}/md5/${logoFile.md5}`;
      }
    }

    return url;
  },
  coverPhotoUrl () {
    let url;

    // Check cover photo exist
    if (this.coverPhotoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(this.coverPhotoFileId);

      // Get cover photo file Object
      const coverPhotoFile = CoverPhoto.findOne(objectId);

      // Check if cover photo file exists
      if (coverPhotoFile) {
        // Get cover photo meteor base URL
        const coverPhotoMeteorBaseUrl = Meteor.absoluteUrl().slice(-1, -1) + CoverPhoto.baseURL;

        // Get full URL to file
        url = `${coverPhotoMeteorBaseUrl}/md5/${coverPhotoFile.md5}`;
      }
    }
    return url;
  },
});
