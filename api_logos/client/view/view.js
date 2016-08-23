import { ApiLogos } from '../../collection';

Template.viewApiLogo.onCreated(function() {
  const instance = this;
  // Subscribe to API logo
  instance.subscribe('allApiLogo');

});

Template.viewApiLogo.helpers({
  uploadedApiLogoLink: function() {
    // Get API current API Backend from template data
    const currentApiBackend = Template.currentData().apiBackend;

    if (currentApiBackend && currentApiBackend.apiLogoFileId) {
      const currentApiLogoFileId = currentApiBackend.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(currentApiLogoFileId);

      // Get API logo file Object
      const currentApiLogoFile = ApiLogos.findOne(objectId);

      // Check if API logo file is available
      if (currentApiLogoFile) {

        // Get API logo file URL
        // TODO: shorten this line, possibly dividing it in two steps
        // Also, make sure the /md5/ should still be in the path
        return Meteor.absoluteUrl().slice(0, -1) + ApiLogos.baseURL + "/md5/" + currentApiLogoFile.md5;
      }
    }
  },
  apiLogoExists: function () {
    const currentApiBackend = Template.currentData().apiBackend;

    if (currentApiBackend.apiLogoFileId) {
      return true;
    }
  }
});
