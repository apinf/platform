Meteor.publish('apiUmbrellaUsers', function () {
  return ApiUmbrellaUsers.find();
});
