Template.settings.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.settings.helpers({
  settings: function () {
    return Settings.findOne();
  }
});
