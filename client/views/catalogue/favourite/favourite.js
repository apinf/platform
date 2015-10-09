Template.favourite.created = function () {
  // subscribe to user bookmarks
  var bookmarksSubscription = this.subscribe('myApiBookmarks');
};

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
    // Get current user bookmark (should be only one API Bookmarks result available)
    var userBookmarks = ApiBookmarks.findOne();

    // get array of API IDs
    var apiIds = userBookmarks.apiIds;

    //Store api id being clicked
    var backendId = this._id;

    // Get index of current API in user bookmarks, if it exists
    var bookmarkIndex = apiIds.indexOf(backendId);

    // Check if API has been bookmarked (converting the index to true or false)
    var isBookmarked = (bookmarkIndex >= 0) ? true : false;

    return isBookmarked;
  }
});
