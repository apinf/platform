Meteor.publish('catalogue', function () {
  // Find all API Backends
  return ApiBackends.find();
});
