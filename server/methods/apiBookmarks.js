Meteor.methods({
  "bookmarkApi": function (backendId, currentUserId) {
    // object to store currentUserId and the Api ID
    var bookmark = {user: currentUserId, api: backendId};

    // Insert bookmark to database
    ApiBookmarks.insert(bookmark);
  }
});

