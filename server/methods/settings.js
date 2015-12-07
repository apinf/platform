Meteor.methods({
  'updateMeteorSettings': function() {
    // Updating Meteor.settings from Settings collection
    settings = Settings.findOne();
    Meteor.settings.private = settings;
  }
})
