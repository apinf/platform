Meteor.methods({
  "bookmarkApi": function (backendId, currentUserId) {

    var apiBackendIds = [];
    apiBackendIds.push(backendId);

    // object to store currentUserId and the Api ID
    var userBookmarks = {userId: currentUserId, apiIds: apiBackendIds};

    var existingUserBookmarks = ApiBookmarks.findOne({userId: currentUserId});
    if (existingUserBookmarks) {
      var apiIds = existingUserBookmarks.apiIds;


      // Check if bookmark exists (returns -1 if not)
      var bookmarkIndex = apiIds.indexOf(backendId);

      // Converts bookmarkIndex to boolean for easier comparison
      var bookmarkExists = (bookmarkIndex >= 0) ? true : false;


      // Checks if bookmark doesnt exist.
      if (!bookmarkExists) {
        // appending backendid to apiIds
        apiIds.push(backendId);
        // Updating current user apiBookmarks
        ApiBookmarks.update({userId: currentUserId},{$set: {apiIds: apiIds} });
      }
    }
    else {
      // Insert bookmark to database
      ApiBookmarks.insert(userBookmarks);
    }
  }


});

