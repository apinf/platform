Meteor.publish('allApiDocumentation', function () {
  // Check if the user is signed in
  if (this.userId) {
    // Return all API Documentation
    return ApiDocumentation.find();
  }
    // Return nothing
  return null;
});
