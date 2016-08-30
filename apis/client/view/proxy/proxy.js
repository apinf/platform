import { ProxyBackends } from '/proxy_backends/collection';

Template.apiProxy.helpers({
  proxyBackendsCollection () {
    // Return a reference to ProxyBackends collection, for AutoForm
    return ProxyBackends;
  }
});
