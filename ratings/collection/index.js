export const ApiBackendRatings = new Mongo.Collection('apiBackendRatings');

Schemas.ApiBackendRating = new SimpleSchema({
  'apiBackendId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'rating': {
    type: Number,
    min: 0,
    max: 4,
  },
});

ApiBackendRatings.attachSchema(Schemas.ApiBackendRating);

ApiBackendRatings.allow({
  insert (userId, rating) {
    // User must be logged in to vote
    if (userId) {
      return true;
    }
  },
  update (userId, rating) {
    return true;
  },
});
