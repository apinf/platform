import Clipboard from "clipboard";

Template.viewApiBackendDetails.onCreated(function () {

  // Get reference to template instance
  var instance = this;

  // Create variable to hold API Umbrella base URL
  instance.apiUmbrellaBaseUrl = new ReactiveVar();

  // Get API Umbrella base URL from server
  Meteor.call("getApiUmbrellaBaseUrl", function (error, apiUmbrellaBaseUrl) {
    // Set reactive variable to contain API Umbrella base URL
    instance.apiUmbrellaBaseUrl.set(apiUmbrellaBaseUrl);
  });
});

Template.viewApiBackendDetails.helpers({
  apiUmbrellaBaseUrl: function () {

    // Get reference to template instance
    var instance = Template.instance();

    // Fetch API Backend's frontend prefix value
    var apiBackendFrontendPrefix = instance.data.apiBackend.url_matches[0].frontend_prefix;

    // Get reference to API Umbrella base URL & construct a URI object
    var apiUmbrellaBaseUrl = new URI(instance.apiUmbrellaBaseUrl.get());

    // Append a frontend prefix to a API Umbrella base URL
    apiUmbrellaBaseUrl.segment(0, apiBackendFrontendPrefix);

    // Clean up URL & remove extra slashes
    apiUmbrellaBaseUrl.normalize();

    return apiUmbrellaBaseUrl;
  }
});

Template.viewApiBackendDetails.onRendered(function () {

  // Initialize Clipboard copy button
  let copyButton = new Clipboard("#copyBaseUrl");

  // Tooltip position
  $('#copyBaseUrl').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  // Tell the user when copy is successful
  copyButton.on("success", function () {
    $('#copyBaseUrl').tooltip('hide')
      .attr('data-original-title', 'Copied!')
      .tooltip('show');
  });
});
