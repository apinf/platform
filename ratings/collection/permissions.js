// Collection imports
import ApiBackendRatings from './';

ApiBackendRatings.allow({
  insert (userId) {
    // User must be logged in to vote
    return !!(userId);
  },
  update (userId, rating) {
    return (userId === rating.userId);
  },
});
