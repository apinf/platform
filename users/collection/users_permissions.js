Meteor.users.allow({
  update (currentUserId, user) {
    // Only allow user to update own username
    if (currentUserId === user._id) {
      return true;
    }
  },
});
