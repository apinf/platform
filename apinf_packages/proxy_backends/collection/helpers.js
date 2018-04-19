/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

ProxyBackends.helpers({
  apiName () {
    // Get API ID
    const apiId = this.apiId;
    // Get API
    const api = Apis.findOne(apiId);

    // placeholder for API name
    let apiName = '';

    // Make sure API was found before accessing name property
    if (api) {
      // Set API Name from API
      apiName = api.name;
    }

    return apiName;
  },
  proxyUrl () {
    // Get Proxy ID
    const proxyId = this.proxyId;

    // Get Proxy item
    const proxy = Proxies.findOne(proxyId);

    // Returns Proxy URL if it exists else returns false
    return _.get(proxy, 'apiUmbrella.url', false);
  },
  frontendPrefix () {
    const path = 'apiUmbrella.url_matches[0].frontend_prefix';

    return _.get(this, path, '');
  },
  backendPrefix () {
    const path = 'apiUmbrella.url_matches[0].backend_prefix';

    return _.get(this, path, '');
  },
  apiSlug () {
    // Get API ID
    const apiId = this.apiId;
    // Get API
    const api = Apis.findOne(apiId);

    // placeholder for API slug
    let apiSlug;

    // Make sure API was found before accessing slug property
    if (api) {
      // Get API slug
      apiSlug = api.slug;
    }

    return apiSlug;
  },
});
