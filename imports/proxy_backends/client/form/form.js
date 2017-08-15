/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

// Npm packages imports
import URI from 'urijs';

// Collection imports
import Proxies from '/packages/proxies/collection';
import ProxyBackends from '/packages/proxy_backends/collection';
import deleteProxyBackendConfig from '/packages/proxy_backends/client/methods/delete_proxy_backend';

Template.proxyBackend.onCreated(() => {
  const instance = Template.instance();

  instance.getProxyId = () => {
    // Set the proxy id empty on default
    instance.proxyId = new ReactiveVar('');
    // Placeholder for current proxy id
    let currentProxyId = '';

    // Get & compare count of Proxies
    const proxyCount = Counts.get('proxyCount');

    // First case: Proxy is only one
    if (proxyCount === 1) {
      // Set these id as current
      currentProxyId = Proxies.findOne()._id;
    } else {
      // Second case: multi proxy

      // Get Proxy Backend config
      const proxyBackend = instance.data.proxyBackend;

      // If ProxyBackend configuration exists then it has a proxy id
      if (proxyBackend) {
        // Save the current proxy id
        currentProxyId = proxyBackend.proxyId;
      } else {
        // Get all proxies ordered by name
        const proxies = Proxies.find({}, { sort: { name: 1 } }).fetch();

        // Set current proxy ID as the first item of the proxies list
        currentProxyId = proxies[0]._id;
      }
    }

    // Save proxy ID in template instance
    instance.proxyId.set(currentProxyId);

    return currentProxyId;
  };

  instance.getProxyId();
});

Template.proxyBackend.helpers({
  apiProxySettings () {
    // Get API ID
    const apiId = this.api._id;

    // Look for existing proxy backend document for this API
    return ProxyBackends.findOne({ apiId });
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
    const currentProxyId = instance.proxyId.get();

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

    // Get proxy ID from template instance
    const savedProxyId = instance.proxyId;

    // Make sure proxy ID exists or calculate it
    const proxyId = savedProxyId ? savedProxyId.get() : instance.getProxyId();

    // Find the proxy settings
    const proxy = Proxies.findOne(proxyId);

    if (proxy && proxy.apiUmbrella) {
      // Get frontend host from template instance
      const frontend = new URI(proxy.apiUmbrella.url);

      return frontend.host();
    }
    return '';
  },
  oneProxy () {
    // Get proxy count
    const proxyCount = Counts.get('proxyCount');

    // Check on existing only one proxy
    return proxyCount === 1;
  },
  showDeleteButton () {
    // Get template instance
    const instance = Template.instance();

    // Return boolean value
    return !!(instance.data.proxyBackend);
  },
  equals (a, b) {
    return a === b;
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

    // Check if there is proxy backend with certain type
    if (proxyBackend.type === 'emq' || proxyBackend.type === 'apiUmbrella') {
      // Call deleteProxyBackend
      deleteProxyBackendConfig(proxyBackend);
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
    const selectedItem = event.currentTarget.value;
    // Get number of the previous selected option
    const previousItemNumber = templateInstance.previousItemNumber;

    // Checking of user changed current proxy to another
    if (templateInstance.formType === 'update') {
      Modal.show('changeSelectedProxy', {
        proxyBackendEvent: event,
        proxyBackendForm: templateInstance,
        selectedItem,
        previousItemNumber,
      });
    } else {
      // Set id of proxy selected
      templateInstance.proxyId.set(selectedItem);
    }
  },
});
