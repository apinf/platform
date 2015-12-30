Meteor.methods({
  'updateMeteorSettings': function() {
    // Updating Meteor.settings from Settings collection
    settings = Settings.findOne();
    Meteor.settings = settings;
  },
  'getApiUmbrellaHost': function () {
    // Get API Umbrella base url from settings object
    var apiUmbrellaBaseUrl = new URI(Meteor.settings.apiUmbrella.baseUrl);

    // Get host part of API Umbrella base URL
    var apiUmbrellaHost = apiUmbrellaBaseUrl.host();

    return apiUmbrellaHost;
  }
});
