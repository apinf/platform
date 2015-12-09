Meteor.publish('allApiDocs', function () {
  // Check if the user is signed in
  if (this.userId) {
    // Return all API Documentation
    return ApiDocs.find();
  } else {
    // Return nothing
    return null;
  }
});
