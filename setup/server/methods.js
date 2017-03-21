/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

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
