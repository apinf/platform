Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get base url from settings file
    var apiUmbrellaBaseUrl = Settings.findOne({name: "api_umbrella_base_url"});

    return apiUmbrellaBaseUrl;
  }
});
