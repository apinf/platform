export function githubSettingsValid (settings) {

  if (settings.githubConfiguration) {

    if (settings.githubConfiguration.clientId && settings.githubConfiguration.secret) {

      return true;
    }
  }

  return false;
}

export function apiUmbrellaSettingsValid (settings) {

  if (settings.apiUmbrella) {
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

export function mailSettingsValid (settings) {


  if (settings.mail) {

    if (settings.mail.username && settings.mail.password) {

      return true;
    }
  }

  return false;
}
