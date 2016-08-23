import { ApiLogo } from '/apis/logo/collection/collection';
import { Apis } from '/apis/collection/apis';

Template.viewApiLogo.onCreated(function() {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');

});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink: function() {
    // Get API current API Backend from template data
    const currentApiBackend = Template.currentData().apiBackend;

    const currentApiLogoFileId = Apis.findOne(currentApiBackend._id).apiLogoFileId;

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
    const currentApiBackend = Template.currentData().apiBackend;

    if (currentApiBackend.apiLogoFileId) {
      return true;
    }
  }
});
