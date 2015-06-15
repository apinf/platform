ApiUmbrellaAdmins = new Mongo.Collection('apiUmbrellaAdmins');

ApiUmbrellaAdminsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  username: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  notes:{
    type: String,
    optional: true
  },
  superuser:{
    type: Boolean,
    optional: true
  },
  authentication_token:{
    type: String,
    optional: true
    },
  last_sign_in_provider:{
    type: String,
    optional: true
  },
  sign_in_count: {
    type: NUmber,
    optional: true
  },
  current_sign_in_at: {
  type: Date,
    optional: true
  },
  last_sign_in_at: {
    type: Date,
    optional: true
  },
  current_sign_in_ip: {
    type: String,
    optional: true
  },
  last_sign_in_ip: {
    type: String,
    optional: true
  }
});

ApiUmbrellaAdmins.attachSchema(ApiUmbrellaAdminsSchema);
