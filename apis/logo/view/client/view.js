/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Collection imports
import ApiLogo from '../../collection';

Template.viewApiLogo.onCreated(function () {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');
});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink () {
    // Get API current API Backend from template data
    const api = Template.currentData().api;

    let apiLogoFileUrl;
    if (api && api.apiLogoFileId) {
      const apiLogoFileId = api.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Get API logo file Object
      const apiLogoFile = ApiLogo.findOne(objectId);

      // Check if API logo file is available
      if (apiLogoFile) {
        // Get Meteor absolute URL
        const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

        const baseApiLogoURL = meteorAbsoluteUrl + ApiLogo.baseURL;

        // Get API logo file URL
        apiLogoFileUrl = `${baseApiLogoURL}/md5/${apiLogoFile.md5}`;
      }
    }
    // Return undefined or API logo file URL
    return apiLogoFileUrl;
  },
  apiLogoExists () {
    const api = Template.currentData().api;

    return (api && api.apiLogoFileId);
  },
});
