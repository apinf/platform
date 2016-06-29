Meteor.publish('catalogue', function ({ filterBy, sortBy, sortDirection }) {
  // Set up query object placeholder (default to all documents)
  let selector = {};

  // Set up query options with empty sort settings
  const queryOptions = { sort: { } };

  // Get user ID
  const userId = this.userId;

  // Set up query object, if changes are needed
  if (userId && filterBy === "my-apis") {
    // Set up query where user ID is in manager IDs array
    selector = { managerIds: userId }
  } else if (userId && filterBy === "my-bookmarks") {
    // Get user bookmarks
    const userBookmarks = ApiBookmarks.findOne({userId: userId});

    // Get bookmarked API IDs
    if (userBookmarks) {
      const bookmarkedApiIds = userBookmarks.apiIds;

      // Set up query object to contain bookmarked API IDs
      selector = {_id: {$in: bookmarkedApiIds}};
    }
  };

  // Set up sort direction, for mongo query (ascending = 1; descending = -1)
  if (sortDirection === "ascending") {
    // Sort in ascending order
    sortDirection = 1;
  } else {
    // Sort in descending order
    sortDirection = -1;
  };

  // Set up sort field with sort direction
  queryOptions.sort[sortBy] = sortDirection;

  // Find all API Backends
  return ApiBackends.find(selector, queryOptions);
});

Meteor.publish('catalogueRatings', function () {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', function () {
  // Find all API Backends
  return ApiBookmarks.find();
});
