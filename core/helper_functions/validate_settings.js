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
  if ((typeof settings !== 'undefined') && settings.mail && settings.mail.enabled) {
    // Check if all required email settings exist
    if (settings.mail.username && settings.mail.password &&
      settings.mail.smtpHost && settings.mail.smtpPort ) {
      return true;
    }
  }

  return false;
}

// Validate email address setting
export function contactEmailValid (settings) {
  // Check all properties in nested structure
  if ((typeof settings !== 'undefined') && settings.mail) {
    // Check if toEmail exists
    if (settings.mail.toEmail) {
      // Finally return true
      return true;
    }
  }

  return false;
}
