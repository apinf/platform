Template.feedbackList.created = function () {
  // Subscription to feedback collection
  var currentRouter = Router.current().params._id;
  this.subscribe('apiBackendFeedback', currentRouter);
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
