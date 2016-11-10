import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import $ from 'jquery';
import Clipboard from 'clipboard';
import { ApiKeys } from '/api_keys/collection';
import { Proxies } from '/proxies/collection';

Template.apiDetails.onRendered(() => {
  // Initialize Clipboard copy button
  const copyButton = new Clipboard('#copyApiUrl');

  // Tooltip position
  $('#copyApiUrl').tooltip({
    trigger: 'click',
    placement: 'bottom',
  });

  // Tell the user when copy is successful
  copyButton.on('success', () => {
    $('#copyApiUrl').tooltip('hide')
      .attr('data-original-title', 'Copied!')
      .tooltip('show');
  });
});

Template.apiDetails.helpers({
  proxyUrl () {
    // Get reference to template instance
    const instance = Template.instance();

    // placeholder for output URL
    let proxyUrl;

    if (instance.data.proxyBackend) {

      const proxyBackend = instance.data.proxyBackend;
      // Get the proxy id
      const proxyId = proxyBackend.proxyId;
      // Get the proxy settings
      const proxy = Proxies.findOne(proxyId);
      // Get Proxy host
      const host = proxy.apiUmbrella.url;

      // Get proxy frontend prefix
      let frontendPrefix = '';

      // It can be moment when proxyBackend exists but url_matches isn't
      if (proxyBackend.apiUmbrella.url_matches) {
        frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;
      }

      // Construct the URL from host and base path
      proxyUrl = host + frontendPrefix;
    }
    return proxyUrl;
  },
  apiKey () {
    // Placeholder for API key
    let apiKey;

    // Get current user
    const currentUserId = Meteor.userId();

    // Make sure user exists and has API key
    if (currentUserId) {
      // Get API Key document
      const userApiKey = ApiKeys.findOne({ userId: currentUserId });

      // Check that Umbrella API key exists
      if (userApiKey && userApiKey.apiUmbrella) {
        // Get the API Key, from API key document
        apiKey = userApiKey.apiUmbrella.apiKey;
      }
    }

    return apiKey;
  },
  // api key can be omitted or not?
  disableApiKey () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get values of disable api key
    const disableApiKey = instance.data.proxyBackend.apiUmbrella.settings.disable_api_key;

    return disableApiKey;
  },
  // User has got an api key
  hasApiKey () {
    // Get current user
    const currentUserId = Meteor.userId();

    return ApiKeys.findOne({ userId: currentUserId });
  }
});
