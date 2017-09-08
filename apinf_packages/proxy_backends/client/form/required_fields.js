/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import _ from 'lodash';

export default function requiredFieldsFilled (proxyBackend) {
  // Get value of frontend_prefix or an empty line if it is no value
  const frontendPrefix = _.get(proxyBackend, 'apiUmbrella.url_matches[0].frontend_prefix', '');
  // Get value of backend_prefix
  const backendPrefix = _.get(proxyBackend, 'apiUmbrella.url_matches[0].backend_prefix', '');
  // Get value of host
  const host = _.get(proxyBackend, 'apiUmbrella.servers[0].host', '');
  // Get value of port
  const port = _.get(proxyBackend, 'apiUmbrella.servers[0].port', '');

  // All these fields is required to fill
  return frontendPrefix && backendPrefix && host && port;
}
