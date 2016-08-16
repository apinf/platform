Meteor.methods({
  "isInitialSetupComplete": function() {
    // check if settings details are complete
    let setUpComplete = false;
    const settings = Settings.findOne();

    // set setUpComplete to value of 'initialSetupComplete' property if it exists in Settings object, else return false
    if (settings !== undefined && settings.hasOwnProperty('initialSetupComplete')) {
      setUpComplete = settings.initialSetupComplete;
    } else {
      setUpComplete = false;
    }

    return setUpComplete;
  },
  "initialSetupCompleteTrue": function() {
    // get reference to settings object from collection
    const settings = Settings.findOne();
    // set 'initialSetupComplete' field value to true in document
    Settings.update({ _id: settings._id }, { $set:{ initialSetupComplete : true }});
    return true;
  }
});
