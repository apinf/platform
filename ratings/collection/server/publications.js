import { Meteor } from 'meteor/meteor';
// Collection imports
import ApiBackendRatings from '/ratings/collection';

// User rating for a single API Backend
Meteor.publish('myApiBackendRating', function (apiBackendId) {
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
Meteor.publish('apiBackendRatings', function (apiBackendId) {
  // get API Backend Ratings, excluding the User ID field
  const apiBackendRatings = ApiBackendRatings.find(
    { apiBackendId }
  );

  return apiBackendRatings;
});
