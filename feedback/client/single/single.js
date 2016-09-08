import { FeedbackVotes } from '/feedback_votes/collection';

Template.singleFeedback.created = function () {
  // Get reference to current feedback
  const feedback = this.data;

  // Get ID of current feedback object
  const feedbackId = feedback._id;

  // Subscribe to votes for this feedback
  this.subscribe('getAllVotesForSingleFeedback', feedbackId);
};

Template.singleFeedback.helpers({
  'userUpvote': function () {
    // Get current Feedback ID
    const feedbackId = this._id;

    // Get current User ID
    const userId = Meteor.userId();

    // Build a query for to get current user's feedback
    const query = { feedbackId, userId };

    // Get user vote using query
    const userVote = FeedbackVotes.findOne(query);

    // If user vote is plus one, it is an upvote
    if (userVote && userVote.vote === 1) {
      return 'user-vote';
    }
  },
  'userDownvote': function () {
    // Get current Feedback ID
    const feedbackId = this._id;

    // Get current User ID
    const userId = Meteor.userId();

    // Build a query for to get current user's feedback
    const query = { feedbackId, userId };

    // Get user vote using query
    const userVote = FeedbackVotes.findOne(query);

    // If user vote is minus one, it is a downvote
    if (userVote && userVote.vote === -1) {
      return 'user-vote';
    }
  },
});

Template.singleFeedback.events({
  'click .up-vote': function (event, template) {
    // Get reference to current feedback
    const feedback = this;

    // Get ID of current feedback object
    const feedbackId = feedback._id;

    // Submit upvote (+1) for current feedback
    Meteor.call('submitVote', feedbackId, 1);
  },
  'click .down-vote': function (event, template) {
    // Get reference to current feedback
    const feedback = this;

    // Get ID of current feedback object
    const feedbackId = feedback._id;

    // Submit downvote (-1) for current feedback
    Meteor.call('submitVote', feedbackId, -1);
  },
});
