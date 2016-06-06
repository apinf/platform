Meteor.publish('allApiBackends', function () {
  // Check if the user is signed in
  if (this.userId) {
    // Return all API Backends
    return ApiBackends.find();
  } else {
    // Return nothing
    return null;
  }
});

Meteor.publish('myBookmarkedApis', function () {
  // get current user id
  var userId = this.userId;
  // get user bookmarks object
  var userBookmarksObject = ApiBookmarks.findOne({userId: userId});
  // get user bookmarks list
  var bookmarkedApiIds = userBookmarksObject.apiIds;
  // get apibackends by id
  return ApiBackends.find({_id: {$in: bookmarkedApiIds}});
});

Meteor.publish('myManagedApis', function () {
  // get current user id
  var userId = this.userId;

  // Get API Backends that user manages
  var userManagedApis = ApiBackends.find({managerIds: userId});

  return userManagedApis;
});

Meteor.publish('apiBackend', function (backendId) {
  return ApiBackends.find({_id: backendId});
});

Meteor.publish('latestApiBackends', function (limit) {
  // Return cursor to latest API Backends
  return ApiBackends.find({}, {sort: {created_at: -1}, limit: limit});
});
