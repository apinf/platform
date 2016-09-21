// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Apinf import
import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '/proxies/collection';

// NPM import
import 'urijs';

Template.proxyBackend.helpers({
  apiHost () {
    // Get one proxy from the Proxies collection
    // This assumes we have only one proxy
    // TODO: refactor this method for multi-proxy support
    const api = this.api;

    // Construct URL object for proxy URL
    const apiUrl = URI(api.url);

    // Return the Proxy URL protocol
    return apiUrl.host();
  },
  apiPortHelper () {
    // Placeholder for port
    let port;

    // Get one proxy from the Proxies collection
    // This assumes we have only one proxy
    // TODO: refactor this method for multi-proxy support
    const api = this.api;

    // Construct URL object for proxy URL
    const apiUrl = URI(api.url);

    // Return the Proxy URL protocol
    const protocol = apiUrl.protocol();

    // Common default ports for HTTP/HTTPS
    if (protocol === 'https') {
      port = 443;
    } else if (protocol === 'http') {
      port = 80;
    }

    return port;
  },
  apiProxySettings () {
    // Get API ID
    const apiId = this.api._id;

    // Look for existing proxy backend document for this API
    const apiProxySettings = ProxyBackends.findOne({ apiId });

    return apiProxySettings;
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
  formType () {
    // Placeholder for form type
    let formType;

    // Get API ID
    const apiId = this.api._id;

    // Look for existing proxy backend document for this API
    const existingSettings = ProxyBackends.findOne({ apiId });

    if (existingSettings) {
      formType = 'update';
    } else {
      formType = 'insert';
    }

    return formType;
  },
  proxy () {
    // TODO: determine how to provide proxyId for the ProxyBackend form
    // e.g. will we have more than one proxy?
    // if no, we need also to limit the number of proxies that can be added

    // Get a single Proxy
    const proxy = Proxies.findOne();

    return proxy;
  },
  proxyBackendsCollection () {
    // Return a reference to ProxyBackends collection, for AutoForm
    return ProxyBackends;
  },
  proxyHost () {
    // TODO: determine how to provide proxyId for the ProxyBackend form
    // e.g. will we have more than one proxy?
    // if no, we need also to limit the number of proxies that can be added

    // Get a single Proxy
    const proxy = Proxies.findOne();

    if (proxy && proxy.apiUmbrella) {
      // Get frontend host from template instance
      const frontend = URI(proxy.apiUmbrella.url);

      return frontend.host();
    }
  },
});

Template.apiProxy.events({
  'click #delete-proxy-button': () => {
    /* Function procedure in generic form
    1. Delete API Backend on proxy (eg. API Umbrella)
      - call necessary functions by proxy type
    2. Delete Proxy Backend on Apinf
    */

    // Get template instance
    const instance = Template.instance();

    // Get proxyBackend from template data
    const proxyBackend = instance.data.proxyBackend;

    // Check proxyBackend exists
    if (proxyBackend) {
      // Check if proxyBackend type is apiUmbrella & it has id
      if (proxyBackend.apiUmbrella && proxyBackend.apiUmbrella.id) {
        const umbrellaBackendId = instance.data.proxyBackend.apiUmbrella.id;

        // Delete API Backend on API Umbrella
        Meteor.call(
          'deleteApiBackendOnApiUmbrella',
          umbrellaBackendId,
          (deleteError) => {
            if (deleteError) {
              sAlert.error(`Delete failed on Umbrella:\n ${deleteError}`);
            } else {
              // Publish changes for deleted API Backend on API Umbrella
              Meteor.call(
                'publishApiBackendOnApiUmbrella',
                umbrellaBackendId,
                (publishError) => {
                  if (publishError) {
                    sAlert.error(`Publish failed on Umbrella:\n ${publishError}`);
                  } else if (proxyBackend._id) { // Check proxyBackend has _id
                    // Delete proxyBackend from Apinf
                    ProxyBackends.remove(proxyBackend._id);
                    sAlert.success('Successfully deleted proxy settings');
                  }
                }
              );
            }
          }
        );
      }
    }
  },
});
