Meteor.methods({
  "additionalSetupRequired": function() {
    // check if settings details are complete
    const settings = Settings.findOne();
    const configRequired = settings.initialSetupComplete;  
    console.log("CONFIG REQUIRED: " + configRequired === false || configRequired === undefined);
    return configRequired === false || configRequired === undefined;
  },
  "initialSetupCompleteTrue": function() {
    // get reference to settings object from collection
    const settings = Settings.findOne();
    // set 'initialSetupComplete' field value to true in document
    Settings.update({ _id: settings._id }, { $set:{ initialSetupComplete : true }});
    return true;
  }
});
