import { ApiLogo } from '/apis/logo/collection/collection';
import { ApiBackends } from '/apis/collection/backend';

Template.viewApiLogo.onCreated(function() {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');

  instance.autorun(function () {
    const apiBackend = ApiBackends.findOne(instance.data.apiBackend._id);
    // Save apibackend id
    Session.set('currentApiBackend', apiBackend);
  });
});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink: function() {

    const currentApiLogoFileId = this.apiBackend.apiLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentApiLogoFileId);

    // Get API logo file Object
    const currentApiLogoFile = ApiLogo.findOne(objectId);

    // Check if API logo file is available
    if (currentApiLogoFile) {
      // Get API logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + ApiLogo.baseURL + "/md5/" + currentApiLogoFile.md5;
    }
  },
  apiLogoExists: function () {
    const currentApiBackend = this.apiBackend;
    if (currentApiBackend.apiLogoFileId) {
      return true;
    }
  }
});
