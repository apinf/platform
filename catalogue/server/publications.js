Meteor.publish('catalogue', function (options) {
  // Set up query object placeholder
  let query = {};

  // Get user ID
  const userId = this.userId;

  // Set up query object, if changes are needed
  if (options.filterBy === "my-apis") {
    // Set up query where user ID is in manager IDs array
    query = { managerIds: userId }
  } else if (options.filterBy === "my-bookmarks") {
    // Get user bookmarks
    const userBookmarks = ApiBookmarks.findOne({userId});

    // Get bookmarked API IDs
    const bookmarkedApiIds = userBookmarks.apiIds;

    // Set up query object to contain bookmarked API IDs
    query = {_id: {$in: bookmarkedApiIds}};
  };

  // Find all API Backends
  return ApiBackends.find(query);
});

Meteor.publish('catalogueRatings', function () {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', function () {
  // Find all API Backends
  return ApiBookmarks.find();
});
