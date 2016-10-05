import { Apis } from '../';

Meteor.publish('allApiBackends', function () {
  // Check if the user is signed in
  if (this.userId) {
    // Return all API Backends
    return Apis.find();
  } else {
    // Return nothing
    return null;
  }
});

Meteor.publish('myBookmarkedApis', function () {
  // get current user id
  var userId = this.userId;
  // get user bookmarks object
  var userBookmarksObject = ApiBookmarks.findOne({ userId });
  // get user bookmarks list
  var bookmarkedApiIds = userBookmarksObject.apiIds;
  // get apibackends by id
  return Apis.find({_id: { $in: bookmarkedApiIds }});
});

Meteor.publish('allBookmarks', () => {

  // Fetch all bookmarks
  const bookmarks = ApiBookmarks.find();

  return bookmarks;
});

Meteor.publish('myManagedApis', function () {
  // get current user id
  var userId = this.userId;

  // Get API Backends that user manages
  var userManagedApis = Apis.find({managerIds: userId});

  return userManagedApis;
});

Meteor.publish('apiBackend', function (backendId) {
  return Apis.find({_id: backendId});
});

Meteor.publish('latestApiBackends', function (limit) {
  // Return cursor to latest API Backends
  return Apis.find({ isPublic: true }, { sort: { created_at: -1 }, limit: limit });
});
