/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import _ from 'lodash';

export default function requiredFieldsFilled (proxyBackend) {
  const urlMatches = _.get(proxyBackend, 'apiUmbrella.url_matches', undefined);
  const servers = _.get(proxyBackend, 'apiUmbrella.servers', undefined);

  if (urlMatches && servers) {
    // Get value of frontend_prefix or an empty line if it is no value
    const frontendPrefix = urlMatches[0].frontend_prefix;
    // Get value of backend_prefix
    const backendPrefix = urlMatches[0].backend_prefix;
    // Get value of host
    const host = servers[0].host;
    // Get value of port
    const port = servers[0].port;

    // All these fields is required to fill
    return frontendPrefix && backendPrefix && host && port;
  }

  // Some required fields are empty
  return false;
}
