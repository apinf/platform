/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';

import { OKGAnalytics as okGAnalytics } from '@okgrow/auto-analytics';

import Branding from '/branding/collection';

Meteor.autorun(() => {
  // Get branding
  const branding = Branding.findOne();

  if (branding) {
    const googleAnalytics = branding.analytics.googleAnalytics;

    if (googleAnalytics) {
      const settings = {
        'Google Analytics': { trackingId: googleAnalytics },
      };
      // Run OKGrow analytics
      okGAnalytics(settings);
    }
  }
});
