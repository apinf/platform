Meteor.publish('catalogue', function () {
  // Find all API Backends
  return ApiBackends.find();
});

Meteor.publish('catalogueRatings', function () {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', function () {
  // Find all API Backends
  return ApiBookmarks.find();
});
