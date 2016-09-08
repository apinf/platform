Template.feedbackList.created = function () {
  // Get API Backend ID from URL route
  const apiId = this.data.api._id;

  // Subscribe for all feedback for this API Backend
  this.subscribe('apiBackendFeedback', apiId);
};

Template.feedbackList.helpers({
  'userFeedback': function () {
    return Feedback.find();
  },
  'haveFeedback': function () {
    // Count user's feedback in feedback collection
    const feedbackCount = Feedback.find().count();
    return feedbackCount > 0;
  },
});

Template.feedbackList.events({
  // Delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  },
});
