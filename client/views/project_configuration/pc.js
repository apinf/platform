Template.projectConfiguration.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.projectConfiguration.helpers({
  settings: function () {
    return Settings.findOne();
  }
});
