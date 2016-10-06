import { Roles } from 'meteor/alanning:roles';

// Collection imports
import { Apis } from '/apis/collection';
import { ApiBackendRatings } from '/ratings/collection';
import { ApiBookmarks } from '/bookmarks/collection';

Meteor.publish('catalogue', function ({ filterBy, sortBy, sortDirection }) {
  // Set up query object placeholder
  // default to all public documents
  let selector = { visibility: 'public' };

  // Get user ID
  const userId = this.userId;

  const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

  if (userId) {
    if (userIsAdmin) {
      // Select all APIs
      selector = {};
    } else {
      // If user logged in
      // Select public, managed APIs & APIs user is authorized to see
      selector = {
        $or:
        [
          { visibility: 'public' },
          { managerIds: userId },
          { authorizedUserIds: userId },
        ],
      };
    }
  }

  // Set up query options with empty sort settings
  const queryOptions = { sort: { } };

  // Set up query object, if changes are needed
  if (userId && filterBy === 'my-apis') {
    // Set up query where user ID is in manager IDs array
    selector = { managerIds: userId };
  } else if (userId && filterBy === 'my-bookmarks') {
    // Get user bookmarks
    const userBookmarks = ApiBookmarks.findOne({ userId });

    // Get bookmarked API IDs
    if (userBookmarks) {
      const bookmarkedApiIds = userBookmarks.apiIds;

      // Set up query object to contain bookmarked API IDs which are public
      selector = {
        $or: [
          {
            $and:
            [// User has bookmarked and API is public
                { _id: { $in: bookmarkedApiIds } },
                { visibility: 'public' },
            ],
          },
          {
            $and:
            [// User has bookmarked and is manager (regardless of public status)
              { _id: { $in: bookmarkedApiIds } },
              { managerIds: userId },
            ],
          },
          {
            $and:
            [// User has bookmarked and has view rights to API
              { _id: { $in: bookmarkedApiIds } },
              { authorizedUserIds: userId },
            ],
          },
        ],
      };
    } else {
      // If user has no bookmarks, don't return any results
      return [];
    }
  }

  // Set up sort direction, for mongo query (ascending = 1; descending = -1)
  if (sortDirection === 'ascending') {
    // Sort in ascending order
    sortDirection = 1;
  } else {
    // Sort in descending order
    sortDirection = -1;
  }

  // Set up sort field with sort direction
  queryOptions.sort[sortBy] = sortDirection;

  // Find all API Backends
  return Apis.find(selector, queryOptions);
});

Meteor.publish('catalogueRatings', () => {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', () => {
  // Find all API Backends
  return ApiBookmarks.find();
});
