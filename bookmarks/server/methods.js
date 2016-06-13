Meteor.methods({
  "toggleBookmarkApi": function (backendId, currentUserId) {
    // Create an array containing the backend ID for use in the collection query, etc.
    var apiBackendIds = [];
    apiBackendIds.push(backendId);

    // object to store currentUserId and the Api ID
    var userBookmarks = {userId: currentUserId, apiIds: apiBackendIds};

    // If possible, get the bookmarks for current user.
    var existingUserBookmarks = ApiBookmarks.findOne({userId: currentUserId});

    // Check if user has existing bookmarks
    if (existingUserBookmarks) {
      // Get an array of bookmark IDs
      var apiIds = existingUserBookmarks.apiIds;

      // Check if bookmark exists (returns -1 if not)
      var bookmarkIndex = apiIds.indexOf(backendId);

      // Converts bookmarkIndex to boolean for easier comparison
      var bookmarkExists = (bookmarkIndex >= 0) ? true : false;

      // Checks if bookmark doesnt exist.
      if (!bookmarkExists) {
        // appending backendId to apiIds
        apiIds.push(backendId);
      } else {
        // removing backendId from apiIds
        apiIds.splice(bookmarkIndex, 1);
      }

      // Updating current user apiBookmarks
      ApiBookmarks.update({userId: currentUserId},{$set: { apiIds } });

    } else {
      // Insert bookmark to database
      ApiBookmarks.insert(userBookmarks);
    }

    // Update the API Backend bookmark count
    Meteor.call("setApiBackendBookmarkCount", backendId);

    return apiIds;
  }
});
