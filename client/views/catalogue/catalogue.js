Template.catalogue.helpers({
  userHasBookmarks: function () {
    // Get current user bookmark (should be only one API Bookmarks result available)
    var userBookmarks = ApiBookmarks.findOne();

    // get array of API IDs
    var apiIds = userBookmarks.apiIds;
    console.log(apiIds);

    // Check if user has bookmarked apis
    if(apiIds.length > 0) {
      return true;
    } else {
      return false;
    }
  }
});
