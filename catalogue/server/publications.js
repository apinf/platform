Meteor.publish('catalogue', function (options) {
  // Set up query object placeholder
  let query = {};

  // Get user ID
  const userId = Meteor.user();

  // Set up query object, if changes are needed
  if (options.filterBy === "my-apis") {
    // Set up query where user ID is in manager IDs array
    query = { managerIds: userId }
  } else if (options.filterBy === "my-bookmarks") {
    // Get user bookmarks
    const userBookmarks = Bookmarks.findOne({userId: userId});

    // Get bookmarked API IDs
    const bookmarkedApiIds = userBookmarks.apiIds;

    // Set up query object to contain bookmarked API IDs
    query = {_id: {$in: bookmarkedApiIds}};
  };

  // Set up sort direction, for mongo query
  if (options.sortDirection === "ascending") {
    // Sort in ascending order
    sortDirection = 1;
  } else {
    // Sort in descending order
    sortDirection = -1;
  };

  // Set up query options with sort settings
  const queryOptions = { sort: { sortBy: sortDirection } }

  // Find all API Backends
  return ApiBackends.find(query, queryOptions);
});

Meteor.publish('catalogueRatings', function () {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', function () {
  // Find all API Backends
  return ApiBookmarks.find();
});
