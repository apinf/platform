import { Branding } from '/branding/collection';

Meteor.methods({
  isInitialSetupComplete () {
    // Get branding and settings documents if available
    const settings = Settings.findOne();
    const branding = Branding.findOne();

    // check if settings or branding have been configured
    if (branding || settings) {
      // The platform is ready to use
      return true;
    } else {
      // More configuration is necessary for basic usage
      return false;
    }
  }
});
