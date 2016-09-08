Meteor.methods({
  deleteAccount (userId) {
    if (this.userId === userId) {
      return Meteor.users.remove({
        _id: this.userId,
      });
    }
  },
  countUsers () {
    // Get all users
    const users = Meteor.users.find().fetch();

    // Count the number of users
    const usersCount = users.length;

    return usersCount;
  },
});
