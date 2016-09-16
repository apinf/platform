// Validates github configuration settings
export function githubSettingsValid (settings) {
  if ((typeof settings !== 'undefined') && settings.githubConfiguration) {
    if (settings.githubConfiguration.clientId && settings.githubConfiguration.secret) {
      return true;
    }
  }

  return false;
}

// Validates mail configuration settings
export function mailSettingsValid (settings) {
  if ((typeof settings !== 'undefined') && settings.mail) {
    if (settings.mail.username && settings.mail.password) {
      return true;
    }
  }

  return false;
}

// Validate email address setting
export function contactEmailValid (settings) {
  // Check all properties in nested structure
  if ((typeof settings !== 'undefined') && settings.mail && settings.mail.enabled) {
    if (settings.mail.toEmail) {
      // Finally return true
      return true;
    }
  }

  return false;
}

// Login attempt verifier to require verified email before login
export function loginAttemptVerifier (parameters) {
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
