Meteor.publishComposite('user', function() {
  return {
    find: function() {
      return Meteor.users.find({
        _id: this.userId
      });
    },
    children: [
      {
        find: function(user) {
          var _id;
          _id = user.profile.picture || null;
          return ProfilePictures.find({
            _id: _id
          });
        }
      }
    ]
  };
});
