Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get base url from settings file
    var apiUmbrellaBaseUrl = Meteor.settings.private.apiUmbrella.baseUrl;

    return apiUmbrellaBaseUrl;
  }
});
