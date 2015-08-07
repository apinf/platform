Template.bookmarks.helpers({
  userBookmarks : function() {
    /*
  1. Populate the currentUser with the id of the current user.
  2. Get all bookmarkedApis from the collection for current user
  */
    var currentUserId = Meteor.userId();
    return ApiBookmarks.find({userId: currentUserId});
  }
});

Template.bookmarks.created = function () {
  // subscribe to user bookmarks
  this.subscribe('myApiBookmarks');
  this.subscribe('myBookmarkedApis');
}



