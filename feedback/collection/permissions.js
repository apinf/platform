// Collection imports
import Feedback from './';

Feedback.allow({
  insert (userId) {
    // Allow only registered users to send feedback
    if (userId) {
      return true;
    }
    // Otherwise reject
    return false;
  },
  update (userId, feedback) {
    // Check if user is allowed to edit feedback
    return (feedback && feedback.currentUserCanEdit());
  },
  remove (userId, feedback) {
    // Check if user is allowed to edit feedback
    return (feedback && feedback.currentUserCanEdit());
  },
});
