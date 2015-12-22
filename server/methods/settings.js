Meteor.methods({
  'getApiUmbrellaHost': function () {
    // Get API Umbrella base url from settings object
    var apiUmbrellaBaseUrl = new URI(Meteor.settings.apiUmbrella.baseUrl);

    // Get host part of API Umbrella base URL
    var apiUmbrellaHost = apiUmbrellaBaseUrl.host();

    return apiUmbrellaHost;
  }
});
