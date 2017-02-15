// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';
import { ValidEmail } from 'meteor/froatsnook:valid-email';

// Collection imports
import Settings from '/settings/collection';

Meteor.methods({
  deleteAccount (userId) {
    // Make sure userId is a String
    check(userId, String);

    let user;
    if (this.userId === userId) {
      user = Meteor.users.remove({
        _id: this.userId,
      });
    }
    return user;
  },
  checkIfEmailIsRegistered (email) {
    // Make sure email is a valid email
    check(email, ValidEmail);

    // Get any user with matching email
    const user = Accounts.findUserByEmail(email);

    // placeholder for return value
    let emailIsRegistered;

    // If user is found, then email is registered
    if (user) {
      emailIsRegistered = true;
    } else {
      emailIsRegistered = false;
    }

    return emailIsRegistered;
  },
  sendRegistrationEmailVerification (userId) {
    // Make sure userId is a String
    check(userId, String);

    // Get settings
    const settings = Settings.findOne();

    // Check mail settings have been enabled
    if (settings && settings.mail && settings.mail.enabled) {
      Accounts.sendVerificationEmail(userId);
    }
  },
});
