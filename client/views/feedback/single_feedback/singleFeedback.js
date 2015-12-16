Template.singleFeedback.created = function () {
  var feedback = this.data;
  // Get ID of current feedback object
  var feedbackId = feedback._id;
  // Subscribe to votes for this feedback
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
};

Template.singleFeedback.helpers({
  'userUpvote': function() {
    // Get current Feedback ID
    var feedbackId = this._id;
    
    // Get current User ID
    var userId = Meteor.userId();
    
    // Build a query for to get current user's feedback
    var query = {feedbackId: feedbackId, userId: userId};
    
    // Get user vote using query
    var userVote = FeedbackVotes.findOne(query);
    
    // If user vote is plus one, it is an upvote
    if(userVote && userVote.vote === 1) {
      return 'userVote';
    }
  },
  'userDownvote': function() {
    // Get current Feedback ID
    var feedbackId = this._id;
    
    // Get current User ID
    var userId = Meteor.userId();
    
    // Build a query for to get current user's feedback
    var query = {feedbackId: feedbackId, userId: userId};
    
    // Get user vote using query
    var userVote = FeedbackVotes.findOne(query);
    
    // If user vote is minus one, it is a downvote
    if(userVote && userVote.vote === -1) {
      return 'userVote';
    }
  }
});

Template.singleFeedback.events({
  'click .upvote': function (event, template) {
    // Get reference to current feedback
    var feedback = this;
    
    // Get ID of current feedback object
    var feedbackId = feedback._id;
    
    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .downvote': function (event, template) {
    // Get reference to current feedback
    var feedback = this;
    
    // Get ID of current feedback object
    var feedbackId = feedback._id;
    
    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1);
  }
});
