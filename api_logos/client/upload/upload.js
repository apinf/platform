import { ApiLogos } from '../../collection';
import { ApiBackends } from '/apis/collection/backend';

Template.uploadApiLogo.onCreated(function() {
  const instance = this;

  // Subscribe to API logo
  instance.subscribe('allApiLogo');

});

Template.uploadApiLogo.events({
  'click .delete-apiLogo': function(event, instance) {

    // Show confirmation dialog to user
    const confirmation = confirm(TAPi18n.__('uploadApiLogo_confirm_delete'));


    // Check if user clicked "OK"
    if (confirmation === true) {

      // Get currentApiBackend documentationFileId
      const apiLogoFileId = instance.data.apiBackend.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Remove API logo object
      ApiLogos.remove(objectId);

      // Remove API logo file id field
      ApiBackends.update(
        instance.data.apiBackend._id,
        {$unset: { apiLogoFileId: "" }
      });

      sAlert.success(TAPi18n.__('uploadApiLogo_successfully_deleted'));
    }
  }
});

Template.uploadApiLogo.helpers({
  uploadedLogoLink: function() {

    const currentApiLogoFileId = ApiBackends.findOne().apiLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentApiLogoFileId);

    // Get API logo file Object
    const currentApiLogoFile = ApiLogos.findOne(objectId);

    // Check if API logo file is available
    if (currentApiLogoFile) {

      // Get API logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + ApiLogos.baseURL + "/md5/" + currentApiLogoFile.md5;
    }
  },
  uploadedApiLogoFile: function() {

    const currentApiLogoFileId = ApiBackends.findOne().apiLogoFileId;

    if (currentApiLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(currentApiLogoFileId);

      // Get API logo file Object
      const currentApiLogoFile = ApiLogos.findOne(objectId);

      return currentApiLogoFile;
    }
  }
});
