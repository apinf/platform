import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// Login attempt verifier to require verified email before login
export function loginAttemptVerifier (parameters) {
  // Placeholder for user login allowed
  let userLoginAllowed;

  if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
    // Get user emails
    const emails = parameters.user.emails;

    // Check if any of user's emails are verified
    const verified = _.find(emails, function (email) { return email.verified; });

    // If no email is verified, throw an error
    if (!verified) {
      throw new Meteor.Error(500, TAPi18n.__('loginVerify_errorMessage'));
    }

    // If email is verified and parameters.allowed is true, user login is allowed
    if (verified && parameters.allowed) {
      userLoginAllowed = true;
    }
  } else {
    // User doesn't have registered email, so login not allowed
    userLoginAllowed = false;
  }

  return userLoginAllowed;
}
