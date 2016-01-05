Meteor.methods({
  deleteAccount: function(userId) {
    if (this.userId === userId) {
      return Meteor.users.remove({
        _id: this.userId
      });
    }
  },
  countUsers: function () {
    // Get all users
    var users = Meteor.users.find().fetch();

    // Count the number of users
    var usersCount = users.length;

    return usersCount;
  },
  usernameExists: function(username) {
    return !!Meteor.users.find({'username': username}).count();
  }
});
