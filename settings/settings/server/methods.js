import { apiUmbrellaSettingsValid } from '/lib/helperFunctions/validateSettings';

Meteor.methods({
  'getApiUmbrellaHostName': function () {
    // Get API Umbrella base url from settings object
    const settings = Settings.findOne();
    var apiUmbrellaHostUrl = new URI(settings.apiUmbrella.host);

    // Get host part of API Umbrella host URL
    var apiUmbrellaHost = apiUmbrellaHostUrl.host();

    return apiUmbrellaHost;
  },
  'updateMeteorSettings': function() {
    // Updating Meteor.settings from Settings collection
    const settings = Settings.findOne();
    Meteor.settings = settings;
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
