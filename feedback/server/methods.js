// Collection imports
import { Feedback } from '../collection';
import { FeedbackVotes } from '/feedback_votes/collection';

Meteor.methods({
  'deleteFeedback': function (feedbackId) {
    // Removing feedback from collection
    Feedback.remove(feedbackId);
  },
  'submitVote': function (feedbackId, vote) {
    // Get current User ID
    const userId = Meteor.userId();

    // Get feedback vote for current User / Feedback ID
    const userVote = FeedbackVotes.findOne({ feedbackId, userId });

    // If user has voted
    if (userVote) {
      // Get existing vote value
      const existingVote = userVote.vote;

      // If the existing vote is not same as submitted vote, update users vote.
      if (vote !== existingVote) {
        // Update existing vote, replacing the existing value with new value
        FeedbackVotes.update({
          feedbackId,
          userId: Meteor.userId(),
        }, {
          $set: { vote },
        });

      // Otherwise cancel/remove the vote.
      } else {
        FeedbackVotes.remove(userVote._id);
      }
    } else {
      // User has not voted -> add new user vote
      FeedbackVotes.insert({
        feedbackId,
        userId: Meteor.userId(),
        vote,
      });
    }
  },
});
