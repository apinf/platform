// Validates Api umbrella configuration settings
function hasValidApiUmbrellaSettings (proxy) {
  let isValid;

  if ((typeof proxy !== 'undefined') && proxy.type === 'apiUmbrella') {
    isValid = (
      proxy.apiUmbrella.url &&
      proxy.apiUmbrella.apiKey &&
      proxy.apiUmbrella.authToken
    );
  }
  return isValid;
}

export default hasValidApiUmbrellaSettings;
