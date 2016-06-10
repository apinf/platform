Template.catalogueTable.helpers({
  userHasBookmarks: function () {
    var apiIds;

    // Get current user bookmarks object
    var userBookmarks = ApiBookmarks.findOne();

    if (userBookmarks) {
      // get array of API IDs
      apiIds = userBookmarks.apiIds;
    }

    // Check if user has bookmarked apis
    if(apiIds && apiIds.length > 0) {
      return true;
    } else {
      return false;
    }
  }
});
