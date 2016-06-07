Meteor.methods({
  'getApiUmbrellaBaseUrl': function () {
    // Get API Umbrella base url from settings object
    const settings = Settings.findOne();

    if( settings && settings.apiUmbrella.baseUrl ) {
      var apiUmbrellaBaseUrl = new URI(settings.apiUmbrella.baseUrl);

      return apiUmbrellaBaseUrl;
    } else {
      throw new Meteor.Error('umbrella-baseurl', 'Umbrella baseUrl not found');
    }
  }
});
