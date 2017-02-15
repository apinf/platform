// Collection imports
import ApiBackendRatings from '/ratings/collection';

// User rating for a single API Backend
Meteor.publish('myApiBackendRating', function (apiBackendId) {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  // get current user ID
  const userId = this.userId;

  // get user API Backend rating
  const userApiBackendRatings = ApiBackendRatings.find({
    userId,
    apiBackendId,
  });

  return userApiBackendRatings;
});

// User ratings for all API Backends
Meteor.publish('myApiBackendRatings', function () {
  // get current user ID
  const userId = this.userId;

  // get user API Backend ratings
  const userApiBackendRatings = ApiBackendRatings.find({ userId });

  return userApiBackendRatings;
});

// All ratings for a given API Backend, anonymized
Meteor.publish('apiBackendRatings', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  // get API Backend Ratings, excluding the User ID field
  const apiBackendRatings = ApiBackendRatings.find(
    { apiBackendId }
  );

  return apiBackendRatings;
});
