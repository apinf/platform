// Meteor packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Npm packages imports
import URI from 'urijs';

// Collection imports
import Proxies from '/proxies/collection';
import ProxyBackends from '/proxy_backends/collection';
import deleteProxyBackend from '/proxy_backends/client/methods/delete_proxy_backend';

Template.proxyBackend.onCreated(() => {
  const instance = Template.instance();
  // Set the proxy id empty on default
  // instance.data.proxyId = new ReactiveVar('');

  instance.getProxyId = () => {
    // Placeholder for current proxy id
    let currentProxyId = '';
    // Get & compare count of Proxies
    const proxyCount = Counts.get('proxyCount');
    // Get Proxy Backend config
    const proxyBackendExists = instance.data.proxyBackend;

    // Check if proxy id exists and multi proxy is available
    // It can be a case when proxy id is empty string and
    // proxy is only one then proxy id must be update
    if (instance.data.proxyId !== undefined && proxyCount > 1) {
      // Save the early value
      return instance.data.proxyId.get();
    }

    // If proxy id doesn't exist yet or any more
    if (instance.data.proxyId === undefined) {
      // Create
      instance.data.proxyId = new ReactiveVar('');

      if (proxyBackendExists) {
        // Set the last know proxy id
        currentProxyId = proxyBackendExists.proxyId;
      }
    }

    // Separate two case: proxy is only one or multi proxy

    // First case: Proxy is only one
    if (proxyCount === 1) {
      // Set these id as current
      currentProxyId = Proxies.findOne()._id;
    } else if (proxyBackendExists) {
      // Second case: multi proxy

      // If ProxyBackend configuration exists then it has a proxy id

      // Update & save the current proxy id
      currentProxyId = proxyBackendExists.proxyId;

      // Otherwise empty string is current id (after deleting configuration)
    }

    // Set the current proxy id
    return instance.data.proxyId.set(currentProxyId);
  };
});

Template.proxyBackend.helpers({
  apiHost () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    return apiUrl.host();
  },
  apiPortHelper () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    const protocol = apiUrl.protocol();

    // Common default ports for HTTP/HTTPS
    if (protocol === 'https') {
      return 443;
    }

    if (protocol === 'http') {
      return 80;
    }

    return '';
  },
  apiProxySettings () {
    // Get API ID
    const apiId = this.api._id;

    // Look for existing proxy backend document for this API
    return ProxyBackends.findOne({ apiId });
  },
  apiUrlProtocol () {
   // Get the API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    return apiUrl.protocol();
  },
  formType () {
    const instance = Template.instance();
    // Get API ID
    const apiId = instance.data.api._id;

    // Look for existing proxy backend document for this API
    const existingSettings = ProxyBackends.findOne({ apiId });

    // If settings exist then type will be update otherwise type will be insert
    if (existingSettings) {
      instance.formType = 'update';
    } else {
      instance.formType = 'insert';
    }

    return instance.formType;
  },
  proxy () {
    // Get a reference of Template instance
    const instance = Template.instance();

    // Get current proxy id
    const currentProxyId = instance.data.proxyId.get();

    // Get settings of current Proxy
    return Proxies.findOne(currentProxyId);
  },
  proxyBackendsCollection () {
    // Return a Return a reference to ProxyBackends collection, for AutoForm
    return ProxyBackends;
  },
  proxyHost () {
    // Get a reference of Template instance
    const instance = Template.instance();
    // Get & save current proxy id
    instance.getProxyId();
    const currentProxyId = instance.data.proxyId.get();

    // Find the proxy settings
    const proxy = Proxies.findOne(currentProxyId);

    if (proxy && proxy.apiUmbrella) {
      // Get frontend host from template instance
      const frontend = new URI(proxy.apiUmbrella.url);

      return frontend.host();
    }
    return '';
  },
  oneProxy () {
    // Ger proxy count
    const proxyCount = Proxies.find().count();

    // Check on existing only one proxy
    return proxyCount === 1;
  },
  showDeleteButton () {
    // Get template instance
    const instance = Template.instance();

    // Get proxyBackend from template data
    return instance.data.proxyBackend;
  },
  showForm () {
    // Get a reference of Template instance
    const instance = Template.instance();
    // Get proxy id
    instance.getProxyId();

    // If proxyId is empty then form will be hidden
    return instance.data.proxyId.get();
  },
});

Template.proxyBackend.events({
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
    if (proxyBackend && proxyBackend.apiUmbrella && proxyBackend.apiUmbrella.id) {
      // Call deleteProxyBackend
      deleteProxyBackend(proxyBackend);
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
  'focus select[name="proxyId"]': function (event, templateInstance) {
    // Get and save the current selected item
    templateInstance.previousItemNumber = event.currentTarget.options.selectedIndex;
  },
  'change select[name="proxyId"]': function (event, templateInstance) {
    // Get selected option
    const selectedItem = event.currentTarget.value || '';

    // User changed current proxy to another
    if (templateInstance.formType === 'update') {
      // If user changed to first position then proxy backend will be deleted
      // Otherwise change option
      if (selectedItem === event.currentTarget[0].value) {
        Modal.show('removeSelectedProxy', {
          proxyBackendEvent: event,
          proxyBackend: templateInstance,
        });
      } else {
        Modal.show('changeSelectedProxy', {
          proxyBackendEvent: event,
          proxyBackend: templateInstance,
          selectedItem,
        });
      }
    } else {
      // Set id of proxy selected
      templateInstance.data.proxyId.set(selectedItem);
    }
  },
});
