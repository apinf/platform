Meteor.publish('myApiBookmarks', function() {
  if(this.userId) {
    // get current user id
    var userId = this.userId;

    // returning user bookmarks object
    return ApiBookmarks.find({userId: userId});
  }
})
