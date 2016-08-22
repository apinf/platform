Meteor.users.UserProfileSchema = new SimpleSchema({
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
// Username must be 3-15 alphanumeric string with hyphens allowed.
var usernameRegEx = /^[a-z0-9A-Z_\-]{3,15}$/;

Meteor.users.schema = new SimpleSchema({
  username: {
    type: String,
    regEx: usernameRegEx,
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
    type: Meteor.users.UserProfileSchema
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

// Fetch username invalid message
var usernameInvalid = TAPi18n.__("profile-usernameInvalid");

// Define custom validation error messages
Meteor.users.schema.messages({
  "regEx username": [
    {exp: usernameRegEx, msg: usernameInvalid}
  ]
});

Meteor.users.attachSchema(Meteor.users.schema);

Meteor.users.allow({
  update: function(userId, user) {
    // Only allow user to update own username
    if (userId === user._id) {
      return true;
    } else {
      return false;
    }
  }
});
