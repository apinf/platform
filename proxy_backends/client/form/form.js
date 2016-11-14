// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

// Apinf import
import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '/proxies/collection';
import proxiId from '../select_proxy/select_proxy';

// NPM import
import 'urijs';

// jQuery import
import $ from 'jquery';

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
    const proxy = Proxies.findOne({ _id: proxiId.get() });

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
  oneProxy () {
    const proxyCount = Proxies.find().count();

    return proxyCount === 1;
  },
  showForm () {
    // Show form when proxy is one OR proxy was selected in dropdown list

    // Get proxy count
    const proxyCount = Proxies.find().count();
    // Check selected proxy
    const proxyId = proxiId.get();

    return proxyCount === 1 || proxyId;
  },
  showSaveButton () {
    // Show save button when proxy wasn't selected in dropdown list AND proxy is more then one

    // Get proxy count
    const proxyCount = Proxies.find().count();
    // Check selected proxy: if variable 'proxyId' is empty then no proxy is selected
    const proxyId = proxiId.get();

    return proxyCount > 1 && proxyId === '';
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

    // Check proxyBackend exists, type is apiUmbrella, and it has id
    if (proxyBackend &&
      proxyBackend.apiUmbrella &&
      proxyBackend.apiUmbrella.id) {
        // Call deleteProxyBackend
      Meteor.call('deleteProxyBackend', proxyBackend, (error, result) => {
        if (error) {
          if (error.error === 'delete-error') {
              // Show delete-error
            const deleteErrorMessage = TAPi18n.__('proxyBackendForm_deleteErrorMessage');
            sAlert.error(`${deleteErrorMessage}:\n ${error.error}`);
          } else if (error.error === 'publish-error') {
              // Show publish-error
            const publishErrorMessage = TAPi18n.__('proxyBackendForm_publishErrorMessage');
            sAlert.error(`${publishErrorMessage}:\n ${error.error}`);
          }
        } else {
            // Show successMessage
          const successMessage = TAPi18n.__('proxyBackendForm_deleteSuccessMessage');
          sAlert.success(successMessage);
        }
      });
    }
  },
  // onChange event for checkbox inputs that contain "response_headers" in name
  'change input:checkbox[name*="response_headers"]': (event) => {
    const changedCheckbox = $(event.target);

    const checkboxesArray = $("input:checkbox[name*='response_headers']");
    // If changedCheckbox is checked, uncheck other
    if (changedCheckbox[0].checked) {
      $.each(checkboxesArray, (index, checkbox) => {
        // Don't change checkbox that was just checked
        if (checkbox.id !== changedCheckbox.attr('id')) {
          // Uncheck checkbox
          checkbox.checked = false;
        }
      });
    }
  },
  'click #save-no-one-proxy': (event, template) => {
    // Save 'No oneproxy is selected'
    sAlert.success('Your settings were successfully saved');
    // Get API ID
    const apiId = template.data.api._id;

    // Look for existing proxy backend document for this API
    const apiProxySettings = ProxyBackends.findOne({ apiId });

    if (apiProxySettings) {
      const proxyBackendId = apiProxySettings._id;
      // Unset proxyID
      ProxyBackends.remove(proxyBackendId);
    }
  }
});
