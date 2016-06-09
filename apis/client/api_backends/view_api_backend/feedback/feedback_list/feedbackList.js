Template.feedbackList.created = function () {
  // Get API Backend ID from URL route
  var apiBackendId = Router.current().params._id;

  // Subscribe for all feedback for this API Backend
  this.subscribe('apiBackendFeedback', apiBackendId);
};

Template.feedbackList.helpers({
  'userFeedback' : function() {
    return Feedback.find();
  },
  'haveFeedback' : function() {
    // Count user's feedback in feedback collection
    var feedbackCount  = Feedback.find().count();
    return feedbackCount > 0;
  }
});

Template.feedbackList.events({
  // Delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  }
});
