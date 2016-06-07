import { apiUmbrellaSettingsValid } from '/lib/helperFunctions/validateSettings';

Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {

    const settings = Settings.findOne();

    if (apiUmbrellaSettingsValid(settings)) {

      // Get base url from settings file
      var apiUmbrellaBaseUrl = settings.apiUmbrella.host;

      return apiUmbrellaBaseUrl;
    }
  }
});
