// Collection imports
import Apis from '/apis/collection';
import Feedback from '/feedback/collection';
import FeedbackVotes from './';

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
    if (feedbackVote) {
      /* 1. Allow user to remove own vote */
      if (userId && feedbackVote.userId &&
        userId === feedbackVote.userId) {
        return true;
      }
      /* 2. Allow admins & API owners/managers remove votes */
      // Get feedback by feedbackId of the feedback vote
      const feedback = Feedback.findOne(feedbackVote.feedbackId);
      if (feedback) {
        // Get api by feedback apiBackendId
        const api = Apis.findOne(feedback.apiBackendId);
        // Return true/false based on edit permissions of api
        return (api && api.currentUserCanEdit());
      }
    }
    // Otherwise deny remove vote
    return false;
  },
});
