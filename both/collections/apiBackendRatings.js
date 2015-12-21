ApiBackendRatings = new Mongo.Collection('apiBackendRatings');

Schemas.ApiBackendRating = new SimpleSchema({
  'apiBackendId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'rating': {
    type: Number,
    min: 0,
    max: 4
  }
});

ApiBackendRatings.attachSchema(Schemas.ApiBackendRating);

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
