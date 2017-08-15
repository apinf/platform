/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Apis from '/imports/apis/collection';

Template.apiRemoveAuthorizedUser.events({
  'click #confirm-remove': function (event, templateInstance) {
    // Get API ID
    const apiId = templateInstance.data.api._id;

    // Get User ID
    const userId = templateInstance.data.user._id;

    // Remove User ID from authorized users array
    Apis.update({ _id: apiId },
      { $pull:
         { authorizedUserIds: userId },
      }
     );

    // Dismiss the modal dialogue
    Modal.hide('apiRemoveAuthorizedUser');
  },
});
