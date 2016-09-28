import { FeedbackVotes } from './';

FeedbackVotes.allow({
  insert (userId) {
    // Only allow logged in user to vote
    if (userId) {
      return true;
    }
  },
  update (userId) {
    // TODO: only allow user to update own vote
    if (userId) {
      return true;
    }
  },
  remove (userId) {
    // TODO: only allow user to remove own vote
    if (userId) {
      return true;
    }
  },
});
