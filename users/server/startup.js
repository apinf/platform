// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';

// APINF imports
import loginAttemptVerifier from './login_verify';

Meteor.startup(() => {
  // In case of server restart, we need to set MAIL_URL
  Meteor.call('configureSmtpSettings');
  // Toggle attach login attempt verifier function to account login
  Accounts.validateLoginAttempt(loginAttemptVerifier);
});
