import { ApiLogo } from '/apis/logo/collection/collection';
import { Apis } from '/apis/collection';

Template.viewApiLogo.onCreated(function () {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');
});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink () {
    // Get API current API Backend from template data
    const api = Template.currentData().api;

    if (api && api.apiLogoFileId) {
      const apiLogoFileId = api.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Get API logo file Object
      const apiLogoFile = ApiLogo.findOne(objectId);

      // Check if API logo file is available
      if (apiLogoFile) {
        // Get API logo file URL
        return Meteor.absoluteUrl().slice(0, -1) + ApiLogo.baseURL + '/md5/' + apiLogoFile.md5;
      }
    }
  },
  apiLogoExists () {
    const api = Template.currentData().api;

    if (api && api.apiLogoFileId) {
      return true;
    }
  },
});
