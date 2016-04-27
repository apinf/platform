Meteor.methods({
  "checkRequiredSettings": function() {
    const configRequired = Meteor.settings.initialSetupComplete;  
    return configRequired;
  }
});
