// Collection import
import ApiBackendRatings from './';

ApiBackendRatings.allow({
  insert (userId, rating) {
    // User must be logged in to vote
    if (userId) {
      return true;
    }
  },
  update (userId, rating) {
    if (userId === rating.userId) {
      return true;
    }
  },
});
