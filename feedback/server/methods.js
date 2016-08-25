import { Feedback } from '../collection';

Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  }
});
