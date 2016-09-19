// Login attempt verifier to require verified email before login
export function loginAttemptVerifier (parameters) {
  if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
    const found = _.find(
     parameters.user.emails,
     function(thisEmail) { return thisEmail.verified }
    );

    if (!found) {
      throw new Meteor.Error(500, TAPi18n.__('loginVerify_errorMessage'));
    }
    // return true if verified email, false otherwise.
    return found && parameters.allowed;
  } else {
    // User doesn't have registered emails
    return false;
  }
}
