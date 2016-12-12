import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { loginAttemptVerifier } from './login_verify';

Meteor.startup(() => {
  // Configure accounts
  Accounts.config({
    loginExpirationInDays: 1,
  });
  // In case of server restart, we need to set MAIL_URL
  Meteor.call('configureSmtpSettings');
  // Toggle attach login attempt verifier function to account login
  Accounts.validateLoginAttempt(loginAttemptVerifier);
});
