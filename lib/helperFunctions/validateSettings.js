export function githubSettingsValid (settings) {

  if (settings.githubConfiguration) {

    if (settings.githubConfiguration.clientId && settings.githubConfiguration.secret) {

      return true;
    }
  }

  return false;
}

export function apiUmbrellaSettigsValid (settings) {

  if (
    settings.apiUmbrella.host &&
    settings.apiUmbrella.apiKey &&
    settings.apiUmbrella.authToken &&
    settings.apiUmbrella.baseUrl
  ) {
    return true;
  } else {
    return false;
  }
}
