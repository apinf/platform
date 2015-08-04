ProfilePictures.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  download: function(userId) {
    return true;
  }
});

Meteor.users.allow({
  update: function(userId, doc, fieldNames, modifier) {
    if (userId === doc._id && !doc.username && fieldNames.length === 1 && fieldNames[0] === 'username') {
      return true;
    } else {
      return false;
    }
  }
});
