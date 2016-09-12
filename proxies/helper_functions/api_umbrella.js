// Validates Api umbrella configuration settings
export function apiUmbrellaSettingsValid (proxy) {
  if ((typeof proxy !== 'undefined') && proxy.type === 'apiUmbrella') {
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
