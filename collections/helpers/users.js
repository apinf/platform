Meteor.users.helpers({
  'apiUmbrellaUsers': function () {
    // Return all ApiUmbrellaUsers associated with this user ID
    return ApiUmbrellaUsers.find({userId: this._id});
  }
});
