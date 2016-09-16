Meteor.publish('allUsers', function() {
  return Meteor.users.find({}, {fields: {"username": 1} });
});

Meteor.publishComposite('user', function() {
  return {
    find: function() {
      return Meteor.users.find({
        _id: this.userId
      });
    }
  };
});
