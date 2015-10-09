Template.apiBackendUsageInstructions.created = function () {
  // Get reference to template instance
  var instance = this;

  // Create variable to hold API Umbrella base URL
  instance.apiUmbrellaBaseUrl = new ReactiveVar();
};

Template.apiBackendUsageInstructions.helpers({
  apiUmbrellaBaseUrl: function () {
    return "http://example.com";
  }
});
