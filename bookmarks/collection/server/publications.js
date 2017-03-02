// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import ApiBookmarks from '/bookmarks/collection';

Meteor.publish('userApiBookmarks', function () {
  // Get current user id
  const userId = this.userId;

  if (userId) {
    // Returning user bookmarks object
    return ApiBookmarks.find({ userId });
  }

  return [];
});
