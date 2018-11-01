/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Template.apiSettingsAnalytics.helpers({
  // Schema for SDK Code Generator form
  updateAnalyitcsSchema () {
    // Create simple schema for sdk modal
    return new SimpleSchema({
      proxyBackendId: {
        type: String,
        optional: false,
      },
      lastDay: {
        type: String,
        optional: false,
      },
      daysCount: {
        label: 'Days Count',
        type: Number,
        optional: false,
      },
    });
  },
});
