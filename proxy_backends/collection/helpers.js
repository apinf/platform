/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import Apis from '/apis/collection';
import ProxyBackends from '/proxy_backends/collection';

ProxyBackends.helpers({
// eslint-disable-next-line object-shorthand
  apiName: function () {
    // Get API ID
    const apiId = this.apiId;
    // Get API
    const api = Apis.findOne(apiId);

    // Make sure API was found before accessing name property
    if (api) {
      // Return API Name
      return api.name;
    }
  },
});
