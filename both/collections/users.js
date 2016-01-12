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
// Username must be 3-15 alphanumeric string with hyphens allowed.
Schemas.RegEx.Username = /^[a-z0-9A-Z_\-]{3,15}$/;

Schemas.User = new SimpleSchema({
  username: {
    type: String,
    regEx: Schemas.RegEx.Username,
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

// Define custom validation error messages
Schemas.User.messages({
  "regEx username": [
    {exp: Schemas.RegEx.Username, msg: "Username must be 3-15 alphanumeric string."}
  ]
});

Meteor.users.attachSchema(Schemas.User);

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
