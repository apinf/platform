Meteor.publishComposite('user', function() {
  return {
    find: function() {
      return Meteor.users.find({
        _id: this.userId
      });
    }
  };
});
