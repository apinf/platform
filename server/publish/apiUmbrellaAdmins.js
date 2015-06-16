Meteor.publish('apiUmbrellaAdmins', function () {
  return ApiUmbrellaAdmins.find();
});
