import { ApiLogo } from '/apis/logo/collection/collection';
import { Apis } from '/apis/collection';

Template.uploadApiLogo.onCreated(function () {
  const instance = this;

  // Subscribe to API logo
  instance.subscribe('allApiLogo');
});

Template.uploadApiLogo.events({
  'click .delete-apiLogo': function (event, instance) {
    // Show confirmation dialog to user
    const confirmation = confirm(TAPi18n.__('uploadApiLogo_confirm_delete'));


    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get currentApiBackend documentationFileId
      const apiLogoFileId = instance.data.api.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Remove API logo object
      ApiLogo.remove(objectId);

      // Remove API logo file id field
      Apis.update(instance.data.api._id, { $unset: { apiLogoFileId: '' } });

      sAlert.success(TAPi18n.__('uploadApiLogo_successfully_deleted'));
    }
  },
});

Template.uploadApiLogo.helpers({
  uploadedLogoLink () {
    const apiLogoFileId = Apis.findOne().apiLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

    // Get API logo file Object
    const apiLogoFile = ApiLogo.findOne(objectId);

    // Check if API logo file is available
    if (apiLogoFile) {
      // Get API logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + ApiLogo.baseURL + '/md5/' + apiLogoFile.md5;
    }
  },
  uploadedApiLogoFile () {
    const apiLogoFileId = Apis.findOne().apiLogoFileId;

    if (apiLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Get API logo file Object
      const apiLogoFile = ApiLogo.findOne(objectId);

      return apiLogoFile;
    }
  },
});
