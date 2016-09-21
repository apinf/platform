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

    // Get the proxy settings
    // TODO: refactor this to support multi-proxy
    const proxy = Proxies.findOne();

    // placeholder for output URL
    let proxyUrl;

    // TODO: refactor for multi-proxy
    if (instance.data.proxyBackend) {
      const proxyBackend = instance.data.proxyBackend;

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
});
