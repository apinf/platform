import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { loginAttemptVerifier } from './login_verify';

Meteor.startup(function() {
  // Toggle attach login attempt verifier function to account login
  Accounts.validateLoginAttempt(loginAttemptVerifier);
});
