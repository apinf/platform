import { Settings } from '/settings/collection';

Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get base url from settings collection
    const apiUmbrellaBaseUrl = Settings.findOne().apiUmbrella.host;
    return apiUmbrellaBaseUrl;
  },
});
