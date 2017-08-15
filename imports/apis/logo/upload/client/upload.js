/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/imports/apis/collection';
import ApiLogo from '../../collection';

Template.uploadApiLogo.events({
  'click .delete-apiLogo': function (event, templateInstance) {
    // Show confirmation dialog to user
    // eslint-disable-next-line no-alert
    const confirmation = confirm(TAPi18n.__('uploadApiLogo_confirm_delete'));

    // Check if user clicked "OK"
    if (confirmation === true) {
      // Get Logo ID of current API using reactive way
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
