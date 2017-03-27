/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

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
