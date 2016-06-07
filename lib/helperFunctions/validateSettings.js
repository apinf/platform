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
export function apiUmbrellaSettingsValid (settings) {

  if ((typeof settings !== 'undefined') && settings.apiUmbrella) {
    if (
      settings.apiUmbrella.host &&
      settings.apiUmbrella.apiKey &&
      settings.apiUmbrella.authToken &&
      settings.apiUmbrella.baseUrl
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
