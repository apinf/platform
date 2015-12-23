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

    var apiBackendFrontendPrefix = instance.data.apiBackend.url_matches[0].frontend_prefix;
    
    var apiUmbrellaBaseUrl = new URI(instance.apiUmbrellaBaseUrl.get());

    apiUmbrellaBaseUrl.segment(0, apiBackendFrontendPrefix);

    apiUmbrellaBaseUrl.normalize();

    return apiUmbrellaBaseUrl;
  }
});
