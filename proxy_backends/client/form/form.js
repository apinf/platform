// Meteor package imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Apinf import
import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '/proxies/collection';
import deleteProxyBackend from '../methods/delete_proxy_backend';
import changeSelectedProxy from '../methods/change_selected_proxy';
import deleteSelectedProxy from '../methods/delete_selected_proxy';

// NPM import
import 'urijs';

// jQuery import
import $ from 'jquery';

Template.proxyBackend.onCreated(function () {
  const instance = Template.instance();
  // Set the proxy id empty on default
  instance.data.proxyId = new ReactiveVar('');

  // Placeholder for current proxy id
  let currentProxyId = '';

  const proxyCount = Proxies.find().count();

  // If proxy is only one then set these id on default
  if (proxyCount === 1) {
    currentProxyId = Proxies.findOne()._id;
  }

  // If proxy id already exists then set these id
  const proxyBackanedExists = instance.data.proxyBackend;
  if (proxyBackanedExists) {
    // Update & save the current proxy id
    currentProxyId = proxyBackanedExists.proxyId;
  }

  // Otherwise proxy id is still empty
  instance.data.proxyId.set(currentProxyId);
});

Template.proxyBackend.helpers({
  apiHost () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = URI(api.url);

    // Return the API URL protocol
    return apiUrl.host();
  },
  apiPortHelper () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = URI(api.url);

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
    const apiUrl = URI(api.url);

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
    // Get a reference of proxy backend
    const proxyBackanedExists = instance.data.proxyBackend;

    if (instance.data.proxyId === undefined) {
      // After inserting template variable has become empty but PB configuration exists
      if (proxyBackanedExists) {
        // Set again template variable
        instance.data.proxyId = new ReactiveVar(proxyBackanedExists.proxyId);
      } else {
        // After deleting PB configuration, the form is hidden and both variables are undefined
        instance.data.proxyId = new ReactiveVar('');
      }
    }
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
    // Get a reference of proxy backend
    const proxyBackanedExists = instance.data.proxyBackend;

    if (instance.data.proxyId === undefined) {
      // After inserting template variable has become empty but PB configuration exists
      if (proxyBackanedExists) {
        // Set again template variable
        instance.data.proxyId = new ReactiveVar(proxyBackanedExists.proxyId);
      } else {
        // After deleting PB configuration, the form is hidden and both variables are undefined
        instance.data.proxyId = new ReactiveVar('');
      }
    }
    // Get current proxy id
    const currentProxyId = instance.data.proxyId.get();

    // Find the proxy settings
    const proxy = Proxies.findOne(currentProxyId);

    if (proxy && proxy.apiUmbrella) {
      // Get frontend host from template instance
      const frontend = URI(proxy.apiUmbrella.url);

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
  }
});

Template.proxyBackend.events({
  'click #delete-proxy-button': () => {
    /* Function procedure in generic form
    1. Delete API Backend on proxy (eg. API Umbrella)
      - call necessary functions by proxy type
    2. Delete Proxy Backend on Apinf
    */

    // Notify users about deleting proxy
    const confirmation = confirm('All information will be deleted and API link will be broken!');
    // Check if user clicked "OK"
    if (confirmation === false) {
      return;
    }

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
        deleteSelectedProxy(event, templateInstance);
      } else {
        changeSelectedProxy(event, templateInstance, selectedItem);
      }
    } else {
      // Set id of proxy selected
      templateInstance.data.proxyId.set(selectedItem);
    }
  },
});
