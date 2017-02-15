// Meteor packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apis/collection';
import ApiLogo from '../../collection';

Template.uploadApiLogo.onCreated(function () {
  const instance = this;

  // Subscribe to API logo
  instance.subscribe('allApiLogo');
});

Template.uploadApiLogo.events({
  'click .delete-apiLogo': function (event, templateInstance) {
    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(TAPi18n.__('uploadApiLogo_confirm_delete'));

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get currentApiBackend documentationFileId
      const apiLogoFileId = templateInstance.data.api.apiLogoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Remove API logo object
      ApiLogo.remove(objectId);

      // Remove API logo file id field
      Apis.update(templateInstance.data.api._id, { $unset: { apiLogoFileId: '' } });

      // Get deletion success message
      const message = TAPi18n.__('uploadApiLogo_successfully_deleted');

      sAlert.success(message);
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

    let url;
    // Check if API logo file is available
    if (apiLogoFile) {
      // Get API logo file URL
      url = `${Meteor.absoluteUrl().slice(0, -1) + ApiLogo.baseURL}/md5/${apiLogoFile.md5}`;
    }
    return url;
  },
  uploadedApiLogoFile () {
    const apiLogoFileId = Apis.findOne().apiLogoFileId;

    let apiLogoFile;
    if (apiLogoFileId) {
      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(apiLogoFileId);

      // Get API logo file Object
      apiLogoFile = ApiLogo.findOne(objectId);
    }
    return apiLogoFile;
  },
});
