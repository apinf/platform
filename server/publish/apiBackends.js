Meteor.publish('apiBackends', function () {
  return ApiBackends.find();
});
