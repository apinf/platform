Template.singleFeedback.created = function () {
  var feedback = this.data;
  // Get ID of current feedback object
  var feedbackId = feedback._id;
  // Subscribe to votes for this feedback
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
    // Get ID of current feedback object
    var feedbackId = feedback._id;
    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .downvote': function (event, template) {
    var feedback = this;
    // Get ID of current feedback object
    var feedbackId = feedback._id;
    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1);
  }
});
