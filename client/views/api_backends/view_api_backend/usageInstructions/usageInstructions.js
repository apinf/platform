Template.apiBackendUsageInstructions.created = function () {
  // Get reference to template instance
  var instance = this;

  // Create variable to hold API Umbrella base URL
  instance.apiUmbrellaBaseUrl = new ReactiveVar();

  // Get API Umbrella base URL from server
  Meteor.call("getApiUmbrellaBaseUrl", function (error, apiUmbrellaBaseUrl) {
    // Set reactive variable to contain API Umbrella base URL
    instance.apiUmbrellaBaseUrl.set(apiUmbrellaBaseUrl);
  });
};

Template.apiBackendUsageInstructions.helpers({
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

    if (Meteor.user()) {

      // Add api_key parameter to URL (https://host.com/frontend_prefix?api_key=your_api_key)
      apiUmbrellaBaseUrl.addSearch('api_key', Meteor.user().profile.apiKey);

    } else {

      // Add plain text if user is not authorised
      apiUmbrellaBaseUrl.addSearch('api_key', "your_api_key_here");

    }

    return apiUmbrellaBaseUrl;
  }
});
