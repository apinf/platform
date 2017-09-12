
/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.apiAnalyticPageHeader.onCreated(function () {
  const instance = this;
  // Get ID of current proxy backend
  const proxyBackendId = instance.data.proxyBackendId;
  // Get instance of Proxy Backend
  const proxyBackend = ProxyBackends.findOne(proxyBackendId);

  // Get IDs of relevant API and Proxy
  instance.apiId = proxyBackend.apiId;
  instance.proxyId = proxyBackend.proxyId;
});

Template.apiAnalyticPageHeader.helpers({
  api () {
    // Get ID
    const apiId = Template.instance().apiId;

    return Apis.findOne(apiId);
  },
  proxyName () {
    // Get ID
    const proxyId = Template.instance().proxyId;
    const proxy = Proxies.findOne(proxyId);

    return proxy.name;
  },
});
