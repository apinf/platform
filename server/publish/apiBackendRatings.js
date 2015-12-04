// User rating for a single API Backend
Meteor.publish('myApiBackendRating', function (apiBackendId) {
  // get current user ID
  var userId = this.userId;

  // get user API Backend rating
  var userApiBackendRatings = ApiBackendRatings.find({
    userId: userId,
    apiBackendId: apiBackendId
  });

  return userApiBackendRatings;
});

// User ratings for all API Backends
Meteor.publish('myApiBackendRatings', function () {
  // get current user ID
  var userId = this.userId;

  // get user API Backend ratings
  var userApiBackendRatings = ApiBackendRatings.find({userId: userId});

  return userApiBackendRatings;
});

// All ratings for a given API Backend, anonymized
Meteor.publish('apiBackendRatings', function (apiBackendId) {
  // get API Backend Ratings, excluding the User ID field
  var apiBackendRatings = ApiBackendRatings.find(
    {apiBackendId: apiBackendId}
  );

  return apiBackendRatings;
});
