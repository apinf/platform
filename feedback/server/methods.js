import { Meteor } from 'meteor/meteor';
// Collection imports
import { FeedbackVotes } from '/feedback_votes/collection';
import { Feedback } from '../collection';

Meteor.methods({
  deleteFeedback (feedbackItemId) {
    // 1. Remove feedback votes
    FeedbackVotes.remove({ feedbackId: feedbackItemId });
    // 2. Remove feedback item
    Feedback.remove(feedbackItemId);
  },
  submitVote (feedbackId, vote) {
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
