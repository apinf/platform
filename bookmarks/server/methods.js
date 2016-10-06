import { Meteor } from 'meteor/meteor';
import { Apis } from '/apis/collection';
import { ApiBookmarks } from '/bookmarks/collection';

Meteor.methods({
  toggleBookmarkApi (backendId, currentUserId) {
    // Create an array containing the backend ID for use in the collection query, etc.
    const apiBackendIds = [];
    apiBackendIds.push(backendId);

    // object to store currentUserId and the Api ID
    const userBookmarks = { userId: currentUserId, apiIds: apiBackendIds };

    // If possible, get the bookmarks for current user.
    const existingUserBookmarks = ApiBookmarks.findOne({ userId: currentUserId });

    // Check if user has existing bookmarks
    if (existingUserBookmarks) {
      // Get an array of bookmark IDs
      const apiIds = existingUserBookmarks.apiIds;

      // Check if bookmark exists (returns -1 if not)
      const bookmarkIndex = apiIds.indexOf(backendId);

      // Converts bookmarkIndex to boolean for easier comparison
      const bookmarkExists = (bookmarkIndex >= 0) ? true : false;

      // Checks if bookmark doesnt exist.
      if (!bookmarkExists) {
        // appending backendId to apiIds
        apiIds.push(backendId);
      } else {
        // removing backendId from apiIds
        apiIds.splice(bookmarkIndex, 1);
      }

      // Updating current user apiBookmarks
      ApiBookmarks.update({ userId: currentUserId }, { $set: { apiIds } });
    } else {
      // Insert bookmark to database
      ApiBookmarks.insert(userBookmarks);
    }

    // Get reference to API Backend
    const apiBackend = Apis.findOne(backendId);

    // Get the API Backend bookmark count
    const bookmarkCount = apiBackend.getBookmarkCount();

    // Update the API Backend bookmark count
    Apis.update(apiBackend, { $set: { bookmarkCount } });
  },
});
