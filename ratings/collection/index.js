export const ApiBackendRatings = new Mongo.Collection('apiBackendRatings');

ApiBackendRatings.allow({
  insert (userId, rating) {
    // User must be logged in to vote
    if (userId) {
      return true;
    }
  },
  update (userId, rating) {
    return true;
  },
});
