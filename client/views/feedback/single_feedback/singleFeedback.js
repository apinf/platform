Template.singleFeedback.created = function () {
  // Subscription to feedback collection
  var feedback = this.data;
  var feedbackId = feedback._id;
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
};

Template.singleFeedback.events({
  'click .upvote': function (event, template) {
    var feedback = this;
    var feedbackId = feedback._id;
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .downvote': function (event, template) {
    var feedback = this;
    var feedbackId = feedback._id;
    Meteor.call('submitVote', feedbackId, -1);
  }
});
