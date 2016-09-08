// Validates github configuration settings
export function githubSettingsValid (settings) {

  if ((typeof settings !== 'undefined') && settings.githubConfiguration) {

    if (settings.githubConfiguration.clientId && settings.githubConfiguration.secret) {

      return true;
    }
  }

  return false;
}

// Validates Api umbrella configuration settings
export function apiUmbrellaSettingsValid (proxy) {

  if ((typeof proxy !== 'undefined') && proxy.type === "apiUmbrella") {
    if (
      proxy.apiUmbrella.url &&
      proxy.apiUmbrella.apiKey &&
      proxy.apiUmbrella.authToken
    ) {
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
  if ((typeof settings !== 'undefined') && settings.contactForm) {
    if (settings.contactForm.toEmail) {
      // Finally return true
      return true;
    }
  }

  return false;
}
