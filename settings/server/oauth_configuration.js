// TODO: refactor this to use Settings collection
// TODO: remove from Meteor.startup, run when Settings updated
Meteor.startup(function () {
  if (Meteor.settings && Meteor.settings.serviceConfigurations) {
    return _.each(Meteor.settings.serviceConfigurations, function (config, service) {
      return ServiceConfiguration.configurations.upsert({
        service,
      }, {
        $set: config,
      });
    });
  }
});
