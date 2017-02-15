// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Collection imports
import Apis from '/apis/collection';

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
