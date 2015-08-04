Meteor.startup(function() {
  if (Meteor.isClient) {
    if (Config.defaultLanguage) {
      return TAPi18n.setLanguage(Config.defaultLanguage);
    } else {
      return TAPi18n.setLanguage('en');
    }
  }
});
