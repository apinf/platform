Template.favourite.events({
  'click .bookmark': function () {

    //Store api id being clicked
    var backendId = this._id;

    //Store the user ID of the current user clicking the button
    var currentUserId = Meteor.user()._id;

    // Toggle (add/remove) the bookmark with method toogleBookmarkApi
    Meteor.call("toggleBookmarkApi", backendId, currentUserId);
  }
});

Template.favourite.helpers({
  isBookmarked: function () {

    var userBookmarks = ApiBookmarks.findOne();
    // get array of API IDs
    var apiIds = userBookmarks.apiIds;
    //Store api id being clicked
    var backendId = this._id;
    // Converts bookmarkIndex to boolean for easier comparison
    var bookmarkIndex = apiIds.indexOf(backendId);

    return (bookmarkIndex >= 0) ? true : false;
  }
});

Template.favourite.created = function () {
  // subscribe to user bookmarks
  this.subscribe('myApiBookmarks');
}
