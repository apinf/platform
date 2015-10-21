Template.feedbackList.created = function () {
  this.subscribe('feedback');
};

Template.feedbackList.helpers({
  userFeedback : function() {
    return Feedback.find({});
  }
});
