// Collection imports
import ApiBackendRatings from '/ratings/collection';
import ApiBookmarks from '/bookmarks/collection';

Meteor.publish('catalogueRatings', () => {
  // Find all API Backends
  return ApiBackendRatings.find();
});

Meteor.publish('catalogueBookmarks', () => {
  // Find all API Backends
  return ApiBookmarks.find();
});
