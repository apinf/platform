Schemas.UserProfile = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  company: {
    type: String,
    optional: true
  },
  apiKey: {
    label: 'API key',
    type: String,
    regEx: /^[a-z0-9A-Z]{40}$/,
    optional: true,
    autoform: {
      readonly: true,
      template: "plain"
    }
  }
});

Schemas.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    optional: true
  },
  apiUmbrellaUserId: {
    type: String,
    optional: true
  },
  emails: {
    type: [Object],
    optional: false
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schemas.UserProfile
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [String],
    blackbox: true,
    optional: true
  }
});

Meteor.users.attachSchema(Schemas.User);
