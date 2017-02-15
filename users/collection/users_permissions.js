
Meteor.users.allow({
  update (currentUserId, user) {
    // Only allow user to update own username
    return (currentUserId === user._id);
  },
});
