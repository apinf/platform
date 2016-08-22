import { Settings } from '/platform_settings/collection';

Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get base url from settings collection
    var apiUmbrellaBaseUrl = Settings.findOne().apiUmbrella.host;
    return apiUmbrellaBaseUrl;
  }
});
