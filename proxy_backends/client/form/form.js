// Apinf import
import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '/proxies/collection';

// NPM import
import 'urijs';

Template.proxyBackendForm.helpers({
  proxyBackendsCollection () {
    // Return a reference to ProxyBackends collection, for AutoForm
    return ProxyBackends;
  },
  proxy () {
    // TODO: determine how to provide proxyId for the ProxyBackend form
    // e.g. will we have more than one proxy?
    // if no, we need also to limit the number of proxies that can be added

    // Get a single Proxy
    const proxy = Proxies.findOne();

    return proxy;
  },
  apiUrlProtocol () {
    // Get one proxy from the Proxies collection
    // This assumes we have only one proxy
    // TODO: refactor this method for multi-proxy support
    const api = this.api;

    // Construct URL object for proxy URL
    const apiUrl = URI(api.url);

    // Return the Proxy URL protocol
    return apiUrl.protocol();
  },
});
