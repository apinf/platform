import { Settings } from '/both/collections/settings';

Meteor.methods({
  'updateMeteorSettings': function() {
    // Updating Meteor.settings from Settings collection
    const settings = Settings.findOne();
    Meteor.settings = settings;
  },
  'getApiUmbrellaHost': function () {
    // Get API Umbrella base url from settings object
    const settings = Settings.findOne();

    if( settings && settings.apiUmbrella.baseUrl ) {
      var apiUmbrellaBaseUrl = new URI(settings.apiUmbrella.baseUrl);

      // Get host part of API Umbrella base URL
      var apiUmbrellaHost = apiUmbrellaBaseUrl.host();

      return apiUmbrellaHost;
    } else {
      throw new Meteor.Error('umbrella-baseurl', 'Umbrella baseUrl not found');
    }

  },
  'settingsObjectIsValidAndEmpty': function() {
    // check structure of Meteor.settings object - initially, it should be { public: {} }

    // array reference to keys in Meteor.settings object

    const settingKeys = Object.keys(Meteor.settings);
    if (settingKeys.length === 1 && settingKeys[0] === 'public') {
      return JSON.stringify(Meteor.settings['public']) === JSON.stringify({});
    }

    return false;
  }
});
