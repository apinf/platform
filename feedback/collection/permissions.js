import { Apis } from '/apis/collection';
import { Feedback } from './';

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
    if (feedback && feedback.apiBackendId) {
      const api = Apis.findOne(feedback.apiBackendId);
      // Check api exists
      if (api) {
        return api.currentUserCanEdit();
      }
    }
    return false;
  },
  remove (userId, feedback) {
    // Check if user is allowed to edit feedback
    if (feedback && feedback.apiBackendId) {
      const api = Apis.findOne(feedback.apiBackendId);
      // Check api exists
      if (api) {
        return api.currentUserCanEdit();
      }
    }
    return false;
  },
});
