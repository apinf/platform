Meteor.methods({
  "checkRequiredSettings": function() {
    const configRequired = Meteor.settings.additionalConfigurationRequired;  
    return configRequired;
  }
});
