// User rating for a single API Backend
Meteor.publish('myApiBackendRating', function (apiBackendId) {
  // get current user ID
  var userId = this.userId;

  // get user API Backend ratings
  var userApiBackendRatings = ApiBackendRatings.find({
    userId: userId,
    apiBackendId: apiBackendId
  });

  return userApiBackendRatings;
});
