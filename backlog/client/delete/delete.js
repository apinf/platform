import { ApiBacklogItems } from '../../collection';

Template.deleteBacklogItem.events({
  'click #confirm-delete': function (event, instance) {
    // Get BAcklog Item ID
    const backlogItemId = instance.data.backlogItem._id;

    // Remove the Backlog Item
    ApiBacklogItems.remove(backlogItemId);

    // Close the modal
    Modal.hide("deleteBacklogItem");
  }
});
