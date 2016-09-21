import Clipboard from 'clipboard';

Template.apiDetails.onRendered(function () {
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

Template.apiDetails.helpers({
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
      let basePath = ''
      
      // It can be moment when proxyBackend exists but url_matches isn't
      if (proxyBackend.apiUmbrella.url_matches) {
        basePath = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix
      }

      // Construct the URL from host and base path
      url = host + basePath;
    } else if (instance.data.api) {
      // Get URL from API
      url = instance.data.api.url;
    }

    return url;
  },
});
