import { Accounts } from 'meteor/accounts-base';
import { Settings } from '/settings/collection';

Meteor.methods({
  deleteAccount (userId) {
    if (this.userId === userId) {
      return Meteor.users.remove({
        _id: this.userId,
      });
    }
  },
  checkIfEmailIsRegistered (email) {
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
  sendRegistrationEmailVerification( userId ) {
    // Get settings
    const settings = Settings.findOne();

    // Check mail settings have been enabled
    if(settings && settings.mail && settings.mail.enabled) {
      Accounts.sendVerificationEmail( userId );
    }
  },
});
