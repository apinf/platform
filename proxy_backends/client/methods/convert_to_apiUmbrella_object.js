/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// When there are updating the proxy backend information and changing proxy
// object doesn't have standard fields to creating & publishing in api Umbrella
// This function is conversion

export default function convertToApiUmbrellaObject (noStandardObject) {
  const apiUmbrellaObject = {
    apiId: noStandardObject.apiId,
    proxyId: noStandardObject.proxyId,
    apiUmbrella: {
      backend_host: noStandardObject['apiUmbrella.backend_host'],
      backend_protocol: noStandardObject['apiUmbrella.backend_protocol'],
      balance_algorithm: noStandardObject['apiUmbrella.balance_algorithm'],
      frontend_host: noStandardObject['apiUmbrella.frontend_host'],
      name: noStandardObject['apiUmbrella.name'],
      servers: noStandardObject['apiUmbrella.servers'],
      settings: {
        append_query_string: noStandardObject['apiUmbrella.settings.append_query_string'],
        disable_api_key: noStandardObject['apiUmbrella.settings.disable_api_key'],
        headers_string: noStandardObject['apiUmbrella.settings.headers_string'],
        rate_limit_mode: noStandardObject['apiUmbrella.settings.rate_limit_mode'],
        rate_limits: noStandardObject['apiUmbrella.settings.rate_limits'],
      },
      url_matches: noStandardObject['apiUmbrella.url_matches'],
    },
  };

  return apiUmbrellaObject;
}
