// Meteor packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.deleteFeedbackItem.events({
  'click #confirm-delete': function () {
    // Get Feedback Item ID
    const feedbackItemId = Template.currentData().feedbackItem._id;

    // Call deleteFeedback method
    Meteor.call('deleteFeedback', feedbackItemId);

    // Close modal
    Modal.hide('deleteFeedbackItem');
  },
});
