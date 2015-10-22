Meteor.methods({
  'deleteFeedback': function(feedbackId) {
    Feedback.remove(feedbackId);
  }
});
