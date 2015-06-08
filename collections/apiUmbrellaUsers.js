ApiUmbrellaUsers = new Mongo.Collection('apiUmbrellaUsers');

ApiUmbrellaUsers = new SimpleSchema({
  api_key: {
    type: String,
    optional: true
  },
  created_at: {
    type: Date
  },
  first_name: {
    type: String,
    optional: true
  },
  last_name: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  email_verified: {
    type: Boolean
  },
  website: {
    type: String,
    optional: true
  },
  registration_source: {
    type: String,
    optional: true
  },
  throttle_by_ip: {
    type: Boolean
  },
  disabled_at: {
    type: Date
  },
  roles: {
    type: [String]
  },
});
