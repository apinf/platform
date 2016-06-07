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
