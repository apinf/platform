/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiBookmarks from '/apinf_packages/bookmarks/collection';

Meteor.methods({
  toggleBookmarkApi (backendId, currentUserId) {
    // Make sure backendId is a String
    check(backendId, String);

    // Make sure currentUserId is a String
    check(currentUserId, String);

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
      const bookmarkExists = (bookmarkIndex >= 0);

      // Checks if bookmark exists.
      if (bookmarkExists) {
        // remove backendId from apiIds
        apiIds.splice(bookmarkIndex, 1);
      } else {
        // append backendId to apiIds
        apiIds.push(backendId);
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
