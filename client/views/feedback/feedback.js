Template.feedbackList.created = function () {
  this.subscribe('feedback');
};

Template.feedbackPage.created = function () {
  this.subscribe('feedback');
};

Template.feedbackList.helpers({
  'userFeedbacks' : function() {
    return Feedback.find();
  }
});

Template.feedbackList.events({
  // delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  }
});
