if (Meteor.isServer) {
  Meteor.startup(function() {
    if (Meteor.settings && Meteor.settings.serviceConfigurations) {
      return _.each(Meteor.settings.serviceConfigurations, function(config, service) {
        return ServiceConfiguration.configurations.upsert({
          service: service
        }, {
          $set: config
        });
      });
    }
  });
}
