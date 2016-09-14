import Clipboard from 'clipboard';
import { ApiKeys } from '/api_keys/collection';

Template.viewApiBackendDetails.onRendered(function () {
  // Initialize Clipboard copy button
  const copyButton = new Clipboard('#copyApiUrl');

  // Tooltip position
  $('#copyApiUrl').tooltip({
    trigger: 'click',
    placement: 'bottom',
  });

  // Tell the user when copy is successful
  copyButton.on('success', function () {
    $('#copyApiUrl').tooltip('hide')
      .attr('data-original-title', 'Copied!')
      .tooltip('show');
  });
});

Template.viewApiBackendDetails.helpers({
  url () {
    // Get reference to template instance
    const instance = Template.instance();

    // placeholder for output URL
    let url;

    // TODO: refactor for multi-proxy
    if (instance.data.proxyBackend) {
      const proxyBackend = instance.data.proxyBackend;

      // Get Proxy host
      const host = proxyBackend.apiUmbrella.frontend_host;

      // Get proxy base path
      const basePath = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;

      // Construct the URL from host and base path
      url = host + basePath;
    } else if (instance.data.api) {
      // Get URL from API
      url = instance.data.api.url;
    }

    return url;
  },
  testCallUrl () {
    // Get reference to template instance
    const instance = Template.instance();

    // placeholder for output URL
    let testCallUrl;

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

    if (instance.data.proxyBackend) {
      const proxyBackend = instance.data.proxyBackend;

      // Get Proxy host
      const host = proxyBackend.apiUmbrella.frontend_host;

      // Get proxy base path
      const basePath = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;

      // Construct the URL from host and base path and API key
      testCallUrl = host + basePath + '?api_key=' + apiKey;
    }

    return testCallUrl;
  }
});
