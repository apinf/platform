import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Template } from 'meteor/templating';

import { FeedbackVotes } from '/feedback_votes/collection';
import { Feedback } from '../../collection';

Template.deleteFeedbackItem.events({
  'click #confirm-delete': function () {
    // Get Feedback Item ID
    const feedbackItemId = Template.currentData().feedbackItem._id;

    // 1. Remove feedback votes
    FeedbackVotes.remove({ feedbackId: feedbackItemId });

    // 2. Remove feedback item
    Feedback.remove(feedbackItemId);

    // Close modal
    Modal.hide('deleteFeedbackItem');
  },
});
