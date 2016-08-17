Meteor.methods({
  "isInitialSetupComplete": function() {
    // check if settings and branding have been configured
    // const settings = Settings.findOne();
    const branding = Branding.findOne();

    // Ensure branding has been provided
    // TODO: Add a check to make sure settings have been provided as well
    if (branding) {
      // The platform is ready to use
      return true;
    } else {
      // More configuration is necessary for basic usage
      return false;
    }
  }
});
