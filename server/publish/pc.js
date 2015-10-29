Meteor.publish('settings', function(){
  // show feedback to specific API
  return Settings.find();
});
