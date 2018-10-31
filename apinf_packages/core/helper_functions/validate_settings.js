/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Validates github configuration on LoginPlatforms
export function githubSettingsValid (LoginPlatforms) {
  // Verifies if LoginPlatforms exists and if it has the githubConfiguration property
  if ((typeof LoginPlatforms !== 'undefined') && LoginPlatforms.githubConfiguration) {
    // Verifies if githubConfiguration property has clientId and secret
    if (LoginPlatforms.githubConfiguration.clientId && LoginPlatforms.githubConfiguration.secret) {
      // returns true if get to this point. It has all the required fields
      return true;
    }
  }
  // Returns false if LoginPlatforms does not have all the required fields
  return false;
}

// Validates FIWARE configuration on LoginPlatforms
export function fiwareSettingsValid (LoginPlatforms) {
  // Verifies if LoginPlatforms exists and if it has the fiwareConfiguration property
  if ((typeof LoginPlatforms !== 'undefined') && LoginPlatforms.fiwareConfiguration) {
    // Assigns object reference to variable for better readability
    const fiwareConfiguration = LoginPlatforms.fiwareConfiguration;
    // Verifies if fiwareConfiguration property has clientId, rootURL and secret
    if (fiwareConfiguration.clientId && fiwareConfiguration.secret && fiwareConfiguration.rootURL) {
      // returns true if get to this point. It has all the required fields
      return true;
    }
  }
  // Returns false if LoginPlatforms does not have all the required fields
  return false;
}

// Validates HSL configuration on LoginPlatforms
export function oidcSettingsValid (LoginPlatforms) {
  // Verifies if LoginPlatforms exists and if it has the fiwareConfiguration property
  if ((typeof LoginPlatforms !== 'undefined') && LoginPlatforms.oidcConfiguration) {
    // Verifies if oidcConfiguration property has clientId and secret
    if (LoginPlatforms.oidcConfiguration.clientId &&
        LoginPlatforms.oidcConfiguration.secret) {
      // returns true if get to this point. It has all the required fields
      return true;
    }
  }
  // Returns false if LoginPlatforms does not have all the required fields
  return false;
}

// Validates mail configuration settings
export function mailSettingsValid (settings) {
  if ((typeof settings !== 'undefined') && settings.mail && settings.mail.enabled) {
    // Check if all required email settings exist
    if (settings.mail.username && settings.mail.password &&
      settings.mail.smtpHost && settings.mail.smtpPort) {
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
