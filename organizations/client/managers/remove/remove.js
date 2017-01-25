import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Organizations from '/organizations/collection';

Template.organizationRemoveManagers.events({
  'click #confirm-remove': function (event, templateInstance) {
    // Get organization ID
    const organizationId = templateInstance.data.organization._id;

    // Get User ID
    const userId = templateInstance.data.user._id;

    // Remove User ID from managers array
    Organizations.update({ _id: organizationId },
      { $pull:
         { managerIds: userId },
      }
     );

    // Dismiss the modal dialogue
    Modal.hide('organizationRemoveManagers');
  },
});
