Template.singleFeedback.created = function () {
  // Subscription to feedback collection
  var feedback = this.data;
  var feedbackId = feedback._id;
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
};

Template.singleFeedback.helpers({
  'userUpvote': function() {
    var feedbackId = this._id;
    var userId = Meteor.userId();
    var query = {feedbackId: feedbackId, userId: userId};
    var userVote = FeedbackVotes.findOne(query);
    if(userVote && userVote.vote === 1) {
      return 'userVote';
    }
  },
  'userDownvote': function() {
    var feedbackId = this._id;
    var userId = Meteor.userId();
    var query = {feedbackId: feedbackId, userId: userId};
    var userVote = FeedbackVotes.findOne(query);
    if(userVote && userVote.vote === -1) {
      return 'userVote';
    }
  }
});

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
