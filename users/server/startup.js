Meteor.startup(function() {
  // Login attempt verifier to require verified email before login
  const loginAttemptVerifier = function(parameters) {
    if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
      const found = _.find(
       parameters.user.emails,
       function(thisEmail) { return thisEmail.verified }
      );

      if (!found) {
        throw new Meteor.Error(500, 'We sent you an email. Please verify.');
      }
      // return true if verified email, false otherwise.
      return found && parameters.allowed;
    } else {
      console.log("Sorry, user has no registered emails.");
      return false;
    }
  }
  Accounts.validateLoginAttempt(loginAttemptVerifier);
});
