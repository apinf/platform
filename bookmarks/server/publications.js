Meteor.publish('myApiBookmarks', function () {
  if (this.userId) {
    // get current user id
    const userId = this.userId;

    // returning user bookmarks object
    return ApiBookmarks.find({ userId });
  }
});
