import { ApiLogo } from '/apis/logo/collection/collection';

Template.uploadApiLogo.onCreated(function() {
  const instance = this;

  // Subscribe to API logo
  instance.subscribe('allApiLogo');

  instance.autorun(function () {
    const apiBackend = ApiBackends.findOne(instance.data.apiBackend._id);
    // Save apibackend id
    Session.set('currentApiBackend', apiBackend);
  });
});

Template.uploadApiLogo.events({
  'click .delete-apiLogo': function(event, instance) {

    // Show confirmation dialog to user
    const confirmation = confirm('Are you sure you want to delete this logo?');

    // Check if user clicked "OK"
    if (confirmation === true) {

      // Get currentApiBackend documentationFileId
      const apiLogoFileId = this.apiBackend.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Remove API logo object
      ApiLogo.remove(objectId);

      // Remove API logo file id field
      ApiBackends.update(instance.data.apiBackend._id, {$unset: { apiLogoFileId: "" }});

      sAlert.success('Logo successfully deleted!');

    }
  }
});

Template.uploadApiLogo.helpers({
  uploadedLogoLink: function() {

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
  uploadedApiLogoFile: function() {
    const currentApiBackend = Session.get('currentApiBackend');

    const currentApiLogoFileId = currentApiBackend.apiLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentApiLogoFileId);

    // Get API logo file Object
    const currentApiLogoFile = ApiLogo.findOne(objectId);

    // Check if API logo file is available
    if (currentApiLogoFile) {
      return currentApiLogoFile;
    }
  }
});
