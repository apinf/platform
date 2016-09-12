import { Feedback } from './';

Feedback.allow({
  insert (userId, feedback) {
    if (userId) {
      return true;
    }
  },
});
