Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get base url from settings file
    var apiUmbrellaBaseUrl = Meteor.settings.api_umbrella.base_url;

    return apiUmbrellaBaseUrl;
  }
});
