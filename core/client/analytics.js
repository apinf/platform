/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collection imports
import Branding from '/branding/collection';

// Npm packages imports
import OKGAnalytics from '@okgrow/auto-analytics';

Meteor.autorun(() => {
  // Get branding
  const branding = Branding.findOne();

  if (branding) {
    const googleAnalytics = branding.analytics.googleAnalytics;

    if (googleAnalytics) {
      const settings = {
        'Google Analytics': { trackingId: googleAnalytics },
      };
      // eslint-disable-next-line
      OKGAnalytics(settings);
    }
  }
});
