// When there are updating the proxy backend information and changing proxy
// object doesn't have standard fields to creating & publishing in api Umbrella
// This function is conversion

/* eslint max-len: ["error", 120] */
export default function convertToApiUmbrellaObject (noStandardObject) {
  const apiUmbrellaObject = {};
  apiUmbrellaObject.apiId = noStandardObject.apiId;
  apiUmbrellaObject.proxyId = noStandardObject.proxyId;
  apiUmbrellaObject.apiUmbrella = {};
  apiUmbrellaObject.apiUmbrella.backend_host = noStandardObject['apiUmbrella.backend_host'];
  apiUmbrellaObject.apiUmbrella.backend_protocol = noStandardObject['apiUmbrella.backend_protocol'];
  apiUmbrellaObject.apiUmbrella.balance_algorithm = noStandardObject['apiUmbrella.balance_algorithm'];
  apiUmbrellaObject.apiUmbrella.frontend_host = noStandardObject['apiUmbrella.frontend_host'];
  apiUmbrellaObject.apiUmbrella.name = noStandardObject['apiUmbrella.name'];
  apiUmbrellaObject.apiUmbrella.servers = noStandardObject['apiUmbrella.servers'];
  apiUmbrellaObject.apiUmbrella.settings = {};
  apiUmbrellaObject.apiUmbrella.settings.disable_api_key = noStandardObject['apiUmbrella.settings.disable_api_key'];
  apiUmbrellaObject.apiUmbrella.settings.rate_limit_mode = noStandardObject['apiUmbrella.settings.rate_limit_mode'];
  apiUmbrellaObject.apiUmbrella.settings.rate_limits = noStandardObject['apiUmbrella.settings.rate_limits'];
  apiUmbrellaObject.apiUmbrella.url_matches = noStandardObject['apiUmbrella.url_matches'];

  return apiUmbrellaObject;
}
