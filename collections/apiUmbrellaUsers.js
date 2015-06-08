ApiUmbrellaUsers = new Mongo.Collection('apiUmbrellaUsers');

ApiUmbrellaUsersSchema = new SimpleSchema({
  api_key: {
    type: String,
    optional: true
  },
  created_at: {
    type: Date,
    optional: true
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
    type: Boolean,
    optional: true
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
    type: Date,
    optional: true
  },
  roles: {
    type: [String],
    optional: true
  }
});

ApiUmbrellaUsers.attachSchema(ApiUmbrellaUsersSchema);
