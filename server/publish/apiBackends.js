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

Meteor.publish('singleApiBackend', function (backendId) {
  return ApiBackends.find({_id: backendId});
});
