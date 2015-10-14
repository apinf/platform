RateLimit = new Mongo.Collection('rateLimit');

Schemas.RateLimitSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  duration: {
    type: Number,
    optional: true
  },
  accuracy: {
    type: Number,
    optional: true
  },
  limit_by: {
    type: String,
    optional: true
  },
  limit: {
    type: Number,
    optional: true
  },
  distributed: {
    type: Boolean,
    optional: true
  },
  response_headers: {
    type: Boolean,
    optional: true
  }
});

RateLimit.attachSchema(Schemas.RateLimitSchema);
