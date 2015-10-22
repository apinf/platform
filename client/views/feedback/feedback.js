Template.feedbackList.created = function () {
  this.subscribe('feedback');
};

Template.feedbackPage.created = function () {
  this.subscribe('feedback');
};

Template.feedbackList.helpers({
  userFeedback : function() {
    return Feedback.find().fetch();
  }
});

Template.feedbackPage.helpers({
  'userFeedback' : function () {
    // Get the current user
    var userId = Meteor.user()._id;

    var userFeedback = Feedback.find({author: userId});

    return userFeedback;
  }
});

Template.feedbackList.events({
  // delete feedback
  'click .delete-feedback': function (event) {
    Meteor.call('deleteFeedback', this._id);
  }
});
