Meteor.methods({
  "additionalSetupRequired": function() {
    const configRequired = Meteor.settings.initialSetupComplete;  
    return configRequired === false || configRequired === undefined;
  }
});
