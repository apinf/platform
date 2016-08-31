Meteor.publish('settings', function(){
  return Settings.find();
});

Meteor.publish("singleSetting", function (setting) {
  // Set up a query settings object containing fields and a result limit
  let querySettings = {"fields": {}, "limit": 1};

  // Specify the setting field we want to retrieve (passed in as argument)
  querySettings.fields[setting] = 1;

  // Return a cursor containing only the requested setting from the Settings document
  let cursor = Settings.find({}, querySettings);

  return cursor;
});

