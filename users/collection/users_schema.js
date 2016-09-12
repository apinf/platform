const UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  company: {
    type: String,
    optional: true,
  },
});
// Username must be 3-15 alphanumeric string with hyphens allowed.
const UsernameRegEx = /^[a-z0-9A-Z_\-]{3,15}$/;

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: UsernameRegEx,
    optional: true,
  },
  apiUmbrellaUserId: {
    type: String,
    optional: true,
  },
  emails: {
    type: [Object],
    optional: false,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: UserProfileSchema,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  roles: {
    type: [String],
    blackbox: true,
    optional: true,
  },
});

// Fetch username invalid message
const usernameInvalid = TAPi18n.__('profile-usernameInvalid');

// Define custom validation error messages
UserProfileSchema.messages({
  'regEx username': [
    { exp: UsernameRegEx, msg: usernameInvalid },
  ],
});

Meteor.users.attachSchema(UserProfileSchema);

Meteor.users.allow({
  update (userId, user) {
    // Only allow user to update own username
    if (userId === user._id) {
      return true;
    }
  },
});
