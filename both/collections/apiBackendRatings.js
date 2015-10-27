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
