import { FeedbackVotes } from './';

FeedbackVotes.allow({
  insert (userId) {
    // Only allow logged in user to vote
    if (userId) {
      return true;
    }
    return false;
  },
  update (userId, feedbackVote) {
    // only allow user to update own vote
    if (userId && feedbackVote && feedbackVote.userId &&
      userId === feedbackVote.userId) {
      return true;
    }
    return false;
  },
  remove (userId, feedbackVote) {
    // only allow user to remove own vote
    if (userId && feedbackVote && feedbackVote.userId &&
      userId === feedbackVote.userId) {
      return true;
    }
    return false;
  },
});
