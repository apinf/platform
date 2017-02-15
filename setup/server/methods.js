// Collection imports
import Branding from '/branding/collection';
import Settings from '/settings/collection';

Meteor.methods({
  isInitialSetupComplete () {
    // Get branding and settings documents if available
    const settings = Settings.findOne();
    const branding = Branding.findOne();

    // The platform is ready to use if
    // settings or branding have been configured
    return !!(branding || settings);
  },
});
