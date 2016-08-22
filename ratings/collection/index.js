const ApiBackendRatings = new Mongo.Collection('apiBackendRatings');

export { ApiBackendRatings };

ApiBackendRatings.allow({
  insert: function () {
    // User must be logged in to vote
    if (Meteor.userId()) {
      return true;
    }
  },
  update: function () {
    return true;
  }
});
