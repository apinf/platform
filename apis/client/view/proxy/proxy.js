import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '/proxies/collection';

Template.apiProxy.helpers({
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
});
